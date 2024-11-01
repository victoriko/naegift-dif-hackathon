import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { Member, Prisma } from '@prisma/client';
import { CodeDetailCache } from 'src/code/code-detail.cache';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly codeDetailCache: CodeDetailCache,
  ) {}

  /**
   * Register a new purchase
   *
   * This method handles the registration of a new purchase for a member.
   * It takes the member information and the purchase details as input,
   * processes the purchase, and updates the relevant records in the database.
   *
   * @param member - The member information including member ID and other details
   * @param data - The purchase details including items, quantities, and payment information
   * @returns - The purchase number and UUID of the new purchase
   */
  async create(
    member: Member,
    data: Prisma.PurchaseUncheckedCreateInput,
  ): Promise<any> {
    try {
      const gifterNo = member.memberNo;

      // Start a transaction
      return await this.prisma.$transaction(async (prisma) => {
        // Fetch gifter information
        const gifter = await prisma.member.findUnique({
          where: { memberNo: gifterNo },
        });
        if (!gifter) {
          throw new NotFoundException('Data Not found: Member.');
        }

        const giftNo = data.giftNo;
        const storeNo = data.storeNo;

        // Fetch gift information
        const giftInfo = await prisma.gift.findUnique({
          where: { giftNo, storeNo },
        });
        if (!giftInfo) {
          throw new NotFoundException('Gift information not found.');
        }
        if (giftInfo.state !== 'SS02') {
          throw new ConflictException('Gift not usable: Not for sale.');
        }

        data.gifterNo = gifterNo;
        data.gifterEmail = gifter.email;
        if (gifter.mobile) data.gifterMobile = gifter.mobile;

        // Generate purchase number
        const today = new Date()
          .toLocaleDateString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          .replace(/\. /g, '-') // '2024. 10. 25.' -> '2024-10-25'
          .replace(/\.$/, ''); // Remove trailing period

        // Fetch next sequence number
        const nextSeq =
          await prisma.$queryRaw`SELECT get_next_seq(CAST(${today} AS DATE))`;

        data.purchaseNo = today.replace(/-/g, '') + nextSeq[0].get_next_seq;

        this.logger.log('Purchase:');
        this.logger.log(`data:\n${JSON.stringify(data, null, 2)}`);

        // Register purchase information
        const newPurchase = await prisma.purchase.create({
          data: data,
        });
        const id = newPurchase.id;
        const purchaseNo = newPurchase.purchaseNo;

        // Update purchase information
        const genUuid = uuidv4();
        const purchaseData = {
          giftId: giftInfo.giftId,
          seqNo: giftInfo.countSold + 1,
          uuid: genUuid,
        };
        await prisma.purchase.update({
          where: { id },
          data: purchaseData,
        });

        // Update gift sales count
        let giftData;
        if (giftInfo.countRemained > 1) {
          giftData = {
            countRemained: giftInfo.countRemained - 1,
            countSold: giftInfo.countSold + 1,
          };
        } else if (giftInfo.countRemained === 1) {
          giftData = {
            countRemained: giftInfo.countRemained - 1,
            countSold: giftInfo.countSold + 1,
            state: 'SS04',
          };
        } else {
          giftData = { countSold: giftInfo.countSold + 1 };
        }

        await prisma.gift.update({
          where: { giftNo },
          data: giftData,
        });

        // Register PG history information
        if (data.orderId) {
          const pgHistoryData = {
            orderId: data.orderId,
            email: data.gifterEmail,
            paymentKey: data.paymentKey || null,
          };

          await prisma.pgHistory.create({
            data: pgHistoryData,
          });
        }

        return { purchaseNo, uuid: genUuid };
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e.message);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  /**
   * Search and retrieve purchase list
   *
   * This method searches and retrieves a list of purchases based on the provided filters.
   * It takes the member information and the purchase list DTO as input,
   * applies the necessary filters, and returns the paginated list of purchases along with the total count.
   *
   * @param member - The member information including member ID and other details
   * @param findPurchasesDto - The purchase list filters including pagination and search criteria
   * @param pagination - The pagination details including skip, take, and orderBy options
   * @returns Promise<[any[], number]> - The paginated list of purchases and the total count
   */
  async findAndCountAll(
    where: Prisma.PurchaseWhereInput,
    pagination: {
      skip: number;
      take: number;
      orderBy?: Prisma.PurchaseOrderByWithRelationInput;
    },
  ): Promise<[any[], number]> {
    try {
      const [purchases, count] = await this.prisma.$transaction([
        this.prisma.purchase.findMany({
          where,
          include: {
            gift: {
              include: {
                giftImage: true,
              },
            },
            memberGift: {
              select: {
                state: true,
                validDttm: true,
                qrValue: true,
              },
            },
            refund: true,
          },
          ...pagination,
        }),
        this.prisma.purchase.count({
          where,
        }),
      ]);

      const serverUrl = process.env.SERVER_URL;

      const purchaseList = await Promise.all(
        purchases.map(async (purchase) => {
          const [sendMethodDesc, payMethodDesc, stateDesc, refundStateDesc] =
            await Promise.all([
              this.codeDetailCache.getDetailCodeName(purchase.sendMethod),
              this.codeDetailCache.getDetailCodeName(purchase.payMethod),
              this.codeDetailCache.getDetailCodeName(
                purchase.memberGift?.[0]?.state ?? '',
              ),
              this.codeDetailCache.getDetailCodeName(
                purchase.refund?.[0]?.state ?? '',
              ),
            ]);

          return {
            purchaseNo: purchase.purchaseNo,
            uuid: purchase.uuid,
            storeNo: purchase.storeNo,
            giftNo: purchase.giftNo,
            giftName: purchase.gift.giftName,
            giftDesc: purchase.gift.giftDesc,
            fileUrl: `${serverUrl}/${purchase.gift.giftImage[0]?.filePath ?? ''}`,
            thumbnailFileUrl: `${serverUrl}/${purchase.gift.giftImage[0]?.thumbnail ?? ''}`,
            price: purchase.gift.price,
            validity: purchase.gift.validity,
            validDttm: purchase.memberGift?.[0]?.validDttm ?? null,
            transferTime: purchase.gift.transferTime,
            giftId: purchase.giftId,
            seqNo: purchase.seqNo,
            state: purchase.memberGift?.[0]?.state ?? null,
            stateDesc: stateDesc,
            refundState: purchase.refund?.[0]?.state ?? null,
            refundStateDesc: refundStateDesc,
            refundAmount: purchase.refund?.[0]?.amount ?? null,
            refundFee: purchase.refund?.[0]?.fee ?? null,
            reqDttm: purchase.refund?.[0]?.reqDttm ?? null,
            comDttm: purchase.refund?.[0]?.comDttm ?? null,
            gifterNo: purchase.gifterNo,
            gifterEmail: purchase.gifterEmail,
            gifterMobile: purchase.gifterMobile,
            gifteeNo: purchase.gifteeNo,
            gifteeEmail: purchase.gifteeEmail,
            gifteeMobile: purchase.gifteeMobile,
            memo: purchase.memo,
            qrValue: purchase.memberGift?.[0]?.qrValue ?? null,
            sendMethod: purchase.sendMethod,
            sendMethodDesc: sendMethodDesc,
            payMethod: purchase.payMethod,
            payMethodDesc: payMethodDesc,
            pgId: purchase.pgId,
            pgCode: purchase.pgCode,
            pgOrderId: purchase.orderId,
            pgPaymentKey: purchase.paymentKey,
            pState: purchase.state,
            recvYn: purchase.recvYn,
            payDttm: purchase.payDttm,
            regDttm: purchase.regDttm,
            updDttm: purchase.updDttm,
          };
        }),
      );

      return [purchaseList, count];
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e.message);
    }
  }

  /**
   * Find and retrieve a single purchase
   *
   * This method retrieves a single purchase based on the provided purchase number.
   * It takes the member information and the purchase number as input,
   * verifies the member and purchase information, and returns the detailed purchase information.
   *
   * @param member - The member information including member ID and other details
   * @param purchaseNo - The purchase number to search for
   * @returns Promise<any> - The detailed purchase information
   */
  async findOne(where: Prisma.PurchaseWhereUniqueInput): Promise<any> {
    try {
      const purchase = await this.prisma.purchase.findUnique({
        where,
        include: {
          gift: {
            include: {
              giftImage: true,
            },
          },
          memberGift: {
            select: {
              state: true,
              validDttm: true,
              qrValue: true,
            },
          },
          refund: true,
        },
      });

      if (!purchase) {
        throw new NotFoundException('Data Not found: Purchase information.');
      }

      const serverUrl = process.env.SERVER_URL;
      const [sendMethodDesc, payMethodDesc, stateDesc, refundStateDesc] =
        await Promise.all([
          this.codeDetailCache.getDetailCodeName(purchase.sendMethod),
          this.codeDetailCache.getDetailCodeName(purchase.payMethod),
          this.codeDetailCache.getDetailCodeName(
            purchase.memberGift?.[0]?.state ?? '',
          ),
          this.codeDetailCache.getDetailCodeName(
            purchase.refund?.[0]?.state ?? '',
          ),
        ]);

      return {
        purchaseNo: purchase.purchaseNo,
        uuid: purchase.uuid,
        storeNo: purchase.storeNo,
        giftNo: purchase.giftNo,
        giftName: purchase.gift.giftName,
        giftDesc: purchase.gift.giftDesc,
        fileUrl: `${serverUrl}/${purchase.gift.giftImage[0]?.filePath ?? ''}`,
        thumbnailFileUrl: `${serverUrl}/${purchase.gift.giftImage[0]?.thumbnail ?? ''}`,
        price: purchase.gift.price,
        validity: purchase.gift.validity,
        validDttm: purchase.memberGift?.[0]?.validDttm ?? null,
        transferTime: purchase.gift.transferTime,
        giftId: purchase.giftId,
        seqNo: purchase.seqNo,
        state: purchase.memberGift?.[0]?.state ?? null,
        stateDesc: stateDesc,
        refundState: purchase.refund?.[0]?.state ?? null,
        refundStateDesc: refundStateDesc,
        refundAmount: purchase.refund?.[0]?.amount ?? null,
        refundFee: purchase.refund?.[0]?.fee ?? null,
        reqDttm: purchase.refund?.[0]?.reqDttm ?? null,
        comDttm: purchase.refund?.[0]?.comDttm ?? null,
        gifterNo: purchase.gifterNo,
        gifterEmail: purchase.gifterEmail,
        gifterMobile: purchase.gifterMobile,
        gifteeNo: purchase.gifteeNo,
        gifteeEmail: purchase.gifteeEmail,
        gifteeMobile: purchase.gifteeMobile,
        memo: purchase.memo,
        qrValue: purchase.memberGift?.[0]?.qrValue ?? null,
        sendMethod: purchase.sendMethod,
        sendMethodDesc: sendMethodDesc,
        payMethod: purchase.payMethod,
        payMethodDesc: payMethodDesc,
        pgId: purchase.pgId,
        pgCode: purchase.pgCode,
        pgOrderId: purchase.orderId,
        pgPaymentKey: purchase.paymentKey,
        pState: purchase.state,
        recvYn: purchase.recvYn,
        payDttm: purchase.payDttm,
        regDttm: purchase.regDttm,
        updDttm: purchase.updDttm,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
