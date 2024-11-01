import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
  HttpStatus,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurUser } from 'src/common/decorators/user.decorator';
import { CreatePurchaseDto } from '../dtos/create-purchase.dto';
import { FindPurchasesDto } from '../dtos/find-purchases.dto';
import { Member, Prisma, Purchase } from '@prisma/client';
import { PageResponse } from 'src/common/pagination/page.response';

@Controller('purchase')
@ApiTags('Purchase API')
export class PurchaseController {
  private readonly logger = new Logger(PurchaseController.name);

  constructor(private readonly purchaseService: PurchaseService) {}

  /**
   * Register a new purchase
   *
   * This method handles the registration of a new purchase for a member.
   * It takes the member information and the purchase details as input,
   * processes the purchase, and updates the relevant records in the database.
   *
   * @param member - The member information including member ID and other details
   * @param createPurchaseDto - The purchase details including items, quantities, and payment information
   * @returns void
   */
  @Post('/')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Register Purchased Gift',
    description: 'Registers the information of a purchased gift.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server Error',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid Input' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Gift Information Not Found',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Gift Not Usable' })
  @ApiOkResponse({
    description: 'Success',
    schema: {
      example: {
        resultCode: 200,
        resultMessage: 'SUCCESS',
        data: {
          purchaseNo: 91,
          uuid: '09f62e47-f07b-4f7a-af09-2b48425674ed',
        },
      },
    },
  })
  async create(
    @CurUser('member') member: Member,
    @Body(ValidationPipe) createPurchaseDto: CreatePurchaseDto,
  ): Promise<any> {
    this.logger.log('purchase-create:');
    this.logger.log(`member:\n${JSON.stringify(member, null, 2)}`);
    if (!member) {
      throw new NotFoundException('It must be ShopUser not ShopAdmin.');
    }
    this.logger.log(createPurchaseDto);
    // Ensure gifterNo is set in createPurchaseDto
    createPurchaseDto.gifterNo = member.memberNo;
    const purchaseData: Prisma.PurchaseUncheckedCreateInput = {
      ...createPurchaseDto,
      gifterNo: member.memberNo,
      gifterEmail: member.email,
      gifterMobile: member.mobile,
      purchaseNo: createPurchaseDto.purchaseNo || '', // Ensure purchaseNo is always included
    };
    return await this.purchaseService.create(member, purchaseData);
  }

  /**
   * Search and retrieve purchase list
   *
   * This method searches and retrieves a list of purchases based on the provided filters.
   * It takes the member information and the purchase list DTO as input,
   * applies the necessary filters, and returns the paginated list of purchases along with the total count.
   *
   * @param member - The member information including member ID and other details.
   *                 This is used to verify the member and filter the purchases.
   * @param findPurchasesDto - The search criteria for the purchase list.
   * @param pagination - The pagination details including skip, take, and orderBy options.
   * @returns Promise<[any[], number]> - The paginated list of purchases and the total count.
   *                                     The first element of the tuple is the list of purchases matching the search criteria.
   *                                     The second element is the total count of purchases matching the search criteria.
   */
  @Get('/')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Search and retrieve purchase list',
    description:
      'Search and retrieve a list of purchases based on the provided filters.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member information not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Required input error',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: {
      example: {
        resultCode: 200,
        resultMessage: 'SUCCESS',
        data: {
          pageSize: 10,
          totalCount: 2,
          totalPage: 1,
          list: [
            {
              uuid: 'b63d7693-8a07-4c7a-af4e-1061e2a27dd7',
              memo: null,
              pState: 'C',
              price: 3500,
              state: 'GS01',
              refundState: null,
              refundAmount: null,
              refundFee: null,
              purchaseNo: 51,
              storeNo: 4,
              giftNo: 16,
              giftName: 'Cafe Latte',
              giftDesc: 'The harmony of coffee flavor and rich milk~',
              fileUrl:
                'https://api-dev.naegift.com/gift/file/20240307/1709814622629.png',
              thumbnailFileUrl:
                'https://api-dev.naegift.com/gift/thumbnail/20240307/1709814622629.png',
              validDttm: '2024-06-14T07:44:52.288Z',
              transferTime: '1D',
              giftId: 'caffeL_CafeLatte_4',
              seqNo: 1,
              stateDesc: 'Unused',
              refundStateDesc: null,
              reqDttm: null,
              comDttm: null,
              gifterNo: 2,
              gifterEmail: 'naegift-user1@authrium.com',
              gifterMobile: '010-1111-2222',
              gifteeNo: 10,
              gifteeEmail: 'naegift-user4@authrium.com',
              gifteeMobile: '010-4444-5555',
              qrValue: 'https://api-dev.naegift.com/giftshop-kr-4=16',
              sendMethod: 'SM01',
              sendMethodDesc: 'Copy Link',
              payMethod: 'PM01',
              payMethodDesc: 'Credit Card',
              pgId: 1,
              pgCode: '5983058359385iodutodt598593IUYUYU',
              recvYn: 'Y',
              payDttm: '2024-03-14T07:38:01.372Z',
              regDttm: '2024-03-14T07:38:01.372Z',
              updDttm: '2024-03-14T07:44:52.276Z',
            },
            {
              uuid: '1f666e2b-c373-428c-8de7-bc223633f5a6',
              memo: 'Post purchase test~',
              pState: 'C',
              price: 7000,
              state: 'GS01',
              refundState: null,
              refundAmount: null,
              refundFee: null,
              purchaseNo: 50,
              storeNo: 4,
              giftNo: 15,
              giftName: 'Cappuccino',
              giftDesc: 'The harmony of coffee and cinnamon~',
              fileUrl: 'https://api-dev.naegift.com/',
              thumbnailFileUrl: 'https://api-dev.naegift.com/',
              validDttm: '2024-06-14T06:33:03.847Z',
              transferTime: '1D',
              giftId: 'caffeL_Cappuccino_2',
              seqNo: 17,
              stateDesc: 'Unused',
              refundStateDesc: null,
              reqDttm: null,
              comDttm: null,
              gifterNo: 2,
              gifterEmail: 'naegift-user1@authrium.com',
              gifterMobile: '010-1111-2222',
              gifteeNo: 5,
              gifteeEmail: 'naegift-user3@authrium.com',
              gifteeMobile: '010-4444-5555',
              qrValue: 'https://api-dev.naegift.com/giftshop-kr-4=15',
              sendMethod: 'SM01',
              sendMethodDesc: 'Copy Link',
              payMethod: 'PM01',
              payMethodDesc: 'Credit Card',
              pgId: 1,
              pgCode: '5983058359385iodutodt598593IUYUYU',
              recvYn: 'N',
              payDttm: '2024-03-14T06:33:00.432Z',
              regDttm: '2024-03-14T06:33:00.432Z',
              updDttm: '2024-03-14T06:33:03.827Z',
            },
          ],
        },
      },
    },
  })
  async findAndCountAll(
    @CurUser('member') member: Member,
    @Query() findPurchasesDto: FindPurchasesDto,
  ): Promise<PageResponse<Purchase>> {
    this.logger.log('purchase-findAndCountAll:');
    this.logger.log(`member:\n${JSON.stringify(member, null, 2)}`);
    if (!member) {
      throw new NotFoundException('It must be ShopUser not ShopAdmin.');
    }
    this.logger.log('findPurchasesDto:');
    this.logger.log(findPurchasesDto);
    const { sortOrd } = findPurchasesDto;
    const skip = findPurchasesDto.getOffset();
    const take = findPurchasesDto.getLimit();
    const pagination = {
      skip,
      take,
      orderBy: {
        purchaseNo:
          sortOrd === 'asc' ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
      },
    };
    let where: Prisma.PurchaseWhereInput = {
      gifterNo: member.memberNo,
    };

    // Filter by store number if provided
    if (findPurchasesDto.storeNo) {
      where = {
        ...where,
        storeNo: findPurchasesDto.storeNo,
      };
    }

    // Filter by gift ID if provided
    if (findPurchasesDto.giftId) {
      where = {
        ...where,
        giftId: {
          contains: findPurchasesDto.giftId,
        },
      };
    }

    // Filter by state if provided
    if (findPurchasesDto.state) {
      where = {
        ...where,
        state: findPurchasesDto.state,
      };
    }

    // Filter by order ID if provided
    if (findPurchasesDto.orderId) {
      where = {
        ...where,
        orderId: findPurchasesDto.orderId,
      };
    }

    // Filter by payment key if provided
    if (findPurchasesDto.paymentKey) {
      where = {
        ...where,
        paymentKey: findPurchasesDto.paymentKey,
      };
    }

    // Filter by date range if provided
    if (findPurchasesDto.startDttm) {
      const startDttm = new Date(findPurchasesDto.startDttm);
      if (findPurchasesDto.endDttm) {
        const endDttm = new Date(findPurchasesDto.endDttm);
        const endTime = new Date(endDttm.getTime() + 24 * 60 * 60 * 1000);

        where = {
          ...where,
          payDttm: {
            gte: new Date(startDttm.getTime() + 9 * 60 * 60 * 1000),
            lte: new Date(endTime.getTime() + 9 * 60 * 60 * 1000),
          },
        };
      } else {
        where = {
          ...where,
          payDttm: {
            gte: new Date(startDttm.getTime() + 9 * 60 * 60 * 1000),
          },
        };
      }
    } else if (findPurchasesDto.endDttm) {
      const endDttm = new Date(findPurchasesDto.endDttm);
      const endTime = new Date(endDttm.getTime() + 24 * 60 * 60 * 1000);

      where = {
        ...where,
        payDttm: {
          lte: new Date(endTime.getTime() + 9 * 60 * 60 * 1000),
        },
      };
    }
    const [purchases, total] = await this.purchaseService.findAndCountAll(
      where,
      pagination,
    );

    return new PageResponse<Purchase>(total, take, purchases);
  }

  /**
   * Retrieve detailed purchase information
   *
   * This method retrieves detailed information about a specific purchase.
   * It takes the user and member information along with the purchase number
   * to fetch and return the details of the purchase.
   *
   * @param user - The user making the request
   * @param member - The member associated with the purchase
   * @param purchaseNo - The unique purchase number to retrieve details for
   * @returns Detailed information about the specified purchase
   */
  @Get('/:purchaseNo')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Retrieve detailed purchase information',
    description: 'Retrieves detailed information about a specific purchase.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Member information not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Required input error',
  })
  @ApiOkResponse({
    description: 'Success',
    schema: {
      example: {
        resultCode: 200,
        resultMessage: 'SUCCESS',
        data: {
          uuid: 'b63d7693-8a07-4c7a-af4e-1061e2a27dd7',
          memo: null,
          pState: 'C',
          price: 3500,
          state: 'GS01',
          refundState: null,
          refundAmount: null,
          refundFee: null,
          purchaseNo: 51,
          storeNo: 4,
          giftNo: 16,
          giftName: 'Cafe Latte',
          giftDesc: 'The harmony of coffee flavor and rich milk~',
          fileUrl:
            'https://api-dev.naegift.com/gift/file/20240307/1709814622629.png',
          thumbnailFileUrl:
            'https://api-dev.naegift.com/gift/thumbnail/20240307/1709814622629.png',
          validDttm: '2024-06-14T07:44:52.288Z',
          transferTime: '1D',
          giftId: 'caffeL_CafeLatte_4',
          seqNo: 1,
          stateDesc: 'Unused',
          refundStateDesc: null,
          reqDttm: null,
          comDttm: null,
          gifterNo: 2,
          gifterEmail: 'naegift-user1@authrium.com',
          gifterMobile: '010-1111-2222',
          gifteeNo: 10,
          gifteeEmail: 'naegift-user4@authrium.com',
          gifteeMobile: '010-4444-5555',
          qrValue: 'https://api-dev.naegift.com/giftshop-kr-4=16',
          sendMethod: 'SM01',
          sendMethodDesc: 'Link Copy',
          payMethod: 'PM01',
          payMethodDesc: 'Credit Card',
          pgId: 1,
          pgCode: '5983058359385iodutodt598593IUYUYU',
          recvYn: 'Y',
          validity: '3M',
          payDttm: '2024-03-14T07:38:01.372Z',
          regDttm: '2024-03-14T07:38:01.372Z',
          updDttm: '2024-03-14T07:44:52.276Z',
        },
      },
    },
  })
  async findOne(
    @CurUser('member') member: Member,
    @Param('purchaseNo') purchaseNo: string,
  ): Promise<any> {
    this.logger.log('purchase-findOne:');
    this.logger.log(`member:\n${JSON.stringify(member, null, 2)}`);
    this.logger.log(`purchaseNo: ${purchaseNo}`);
    if (!member) {
      throw new NotFoundException('It must be ShopUser not ShopAdmin.');
    }
    return await this.purchaseService.findOne({ purchaseNo: purchaseNo });
  }
}
