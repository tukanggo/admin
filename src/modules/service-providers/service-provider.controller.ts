import * as _ from 'lodash';
import { Response } from 'express';
import * as Excel from 'exceljs';
import moment from 'moment';
import * as momentTz from 'moment-timezone';
import {
  Controller,
  Get,
  Res,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import * as Xlsx from '@providers/exceljs.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { setFileResHeader } from 'src/utils';
import { GqlRolesGuard, WebJwtAccessAuthGuard } from '@guards/auth.guard';
import { ServiceProvidersEntity } from '@entities';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { exportReportInput } from '@modules/customers';
// import { GetCustomerCheckoutListDTO } from './dto/get-customer-checkout-list.dto';

@ApiTags('Export Report')
@Controller()
export class ServiceProvidersController {
  constructor(
    @InjectRepository(ServiceProvidersEntity)
    private readonly serviceProviderRepo: Repository<ServiceProvidersEntity>,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export Service Provider Report' })
  @UseGuards(WebJwtAccessAuthGuard)
  @Get('reports/top-up')
  async GetTopUpExcel(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Query() query: exportReportInput,
  ) {
    try {
      const { startDate, endDate } = query;
      const transactionList = await this.serviceProviderRepo.query(`
        SELECT t.id, t.type, t.amount, t.remark, t.createdAt, sp.fullName, sp.companyName, sp.phoneNo, sp.email
        FROM service_providers_transactions t
        JOIN service_providers sp ON t.serviceProviderId = sp.id
        WHERE t.deletedAt IS NULL
        ${startDate ? `AND createdAt >= '${moment(startDate).startOf('days').format()}'` : ''}
        ${endDate ? `AND createdAt <= '${moment(endDate).endOf('days').format()}'` : ''}
        ORDER BY createdAt DESC
      `);

      /* --------------------------- Create new Excel -------------------------- */
      const workbook = new Excel.Workbook();
      workbook.created = new Date();

      /* ---------------------------- Create new sheet ---------------------------- */
      const worksheet = workbook.addWorksheet('Top Up Transaction Report', {
        headerFooter: {
          firstHeader: 'Top Up Transaction Report',
          firstFooter: momentTz.tz('Asia/Kuala_Lumpur').format('LLLL'),
        },
      });

      /* ----------------------------- Columns Configs ---------------------------- */
      const currency = { ...Xlsx.style.right, ...Xlsx.style.RM };
      const columns: Xlsx.ParseWorkSheetColumn[] = [
        {
          label: 'Service Provider Name',
          key: 'fullName',
          width: 25,
        },
        {
          label: 'Email',
          key: 'email',
          width: 25,
        },
        {
          label: 'Phone Number',
          key: 'phoneNo',
          width: 25,
        },
        {
          label: 'Transaction Date',
          key: 'createdAt',
          width: 25,
        },
        {
          label: 'Type',
          key: 'type',
          width: 25,
        },
        {
          label: 'Remark',
          key: 'remark',
          width: 25,
        },
        {
          label: 'Amount',
          key: 'amount',
          width: 25,
          style: currency,
        },
      ];

      Xlsx.parseWorksheetHeader(worksheet, {
        title: 'Top-Up Transaction Report',
        columns,
        // filters,
        paddingBottomRows: 1,
      });

      /* ---------------------------- Add Rows to Excel --------------------------- */
      const rows = [];
      _.map(transactionList, (row) => {
        rows.push({
          ...row,
        });
      });
      worksheet.addRows(rows);
      const filename = Xlsx.parseFileName('Top-Up-Transaction-Report');
      setFileResHeader(res, filename);
      await workbook.xlsx.write(res);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export Service Provider Report' })
  @UseGuards(WebJwtAccessAuthGuard)
  @Get('reports/service-provider-list')
  async GetProductExcel(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Query() query: exportReportInput,
  ) {
    const { startDate, endDate } = query;
    try {
      const tukangList = await this.serviceProviderRepo.query(`
        SELECT *
        FROM service_providers
        WHERE deletedAt IS NULL
        ${startDate ? `AND createdAt >= '${moment(startDate).startOf('days').format()}'` : ''}
        ${endDate ? `AND createdAt <= '${moment(endDate).endOf('days').format()}'` : ''}
        ORDER BY createdAt DESC
      `);
      //   const tukangList = await this.serviceProviderRepo.find({
      //     where: {
      //       createdAt: Between(startDate, endDate),
      //     },
      //     select: {
      //       id: true,
      //       fullName: true,
      //       email: true,
      //       phoneCountryCode: true,
      //       phoneNo: true,
      //       companyName: true,
      //       companySSM: true,
      //       jobTitle: true,
      //       bankName: true,
      //       bankAccountNo: true,
      //       bankReceiver: true,
      //       isActive: true,
      //       createdAt: true,
      //     },
      //     order: {
      //       createdAt: 'DESC',
      //     },
      //   });
      const data = _.map(tukangList, (t) => {
        return { ...t, isActive: t.isActive == true ? true : false };
      });
      /* --------------------------- Create new Excel -------------------------- */
      const workbook = new Excel.Workbook();
      workbook.created = new Date();

      /* ---------------------------- Create new sheet ---------------------------- */
      const worksheet = workbook.addWorksheet('Service Provider List Report', {
        headerFooter: {
          firstHeader: 'Service Provider List Report',
          firstFooter: momentTz.tz('Asia/Kuala_Lumpur').format('LLLL'),
        },
      });

      /* ----------------------------- Columns Configs ---------------------------- */
      const currency = { ...Xlsx.style.right, ...Xlsx.style.RM };
      const columns: Xlsx.ParseWorkSheetColumn[] = [
        {
          label: 'Is Active',
          key: 'isActive',
          width: 25,
          style: Xlsx.style.center,
        },
        {
          label: 'Service Provider Name',
          key: 'fullName',
          width: 25,
          style: currency,
        },
        {
          label: 'Email',
          key: 'email',
          width: 25,
          style: currency,
        },
        {
          label: 'Phone Country Code',
          key: 'phoneCountryCode',
          width: 25,
          style: currency,
        },
        {
          label: 'Phone Number',
          key: 'phoneNo',
          width: 25,
          style: currency,
        },
        {
          label: 'Job Title',
          key: 'jobTitle',
          width: 25,
          style: currency,
        },
        {
          label: 'company Name',
          key: 'companyName',
          width: 25,
          style: currency,
        },
        {
          label: 'SSM',
          key: 'companySSM',
          width: 25,
          style: currency,
        },
        {
          label: 'Bank Name',
          key: 'bankName',
          width: 25,
          style: currency,
        },
        {
          label: 'Bank Account',
          key: 'bankAccount',
          width: 25,
          style: currency,
        },
        {
          label: 'Bank Receiver',
          key: 'bankReceiver',
          width: 25,
          style: currency,
        },
        {
          label: 'Remark',
          key: 'remark',
          width: 25,
          style: currency,
        },
        { label: 'Created At', key: 'createdAt', width: 25 },
      ];

      Xlsx.parseWorksheetHeader(worksheet, {
        title: 'Service Provider List Report',
        columns,
        // filters,
        paddingBottomRows: 1,
      });

      /* ---------------------------- Add Rows to Excel --------------------------- */
      const rows = [];
      _.map(data, (row) => {
        rows.push({
          ...row,
        });
      });
      worksheet.addRows(rows);
      const filename = Xlsx.parseFileName('Service-Provider-list-Report');
      setFileResHeader(res, filename);
      await workbook.xlsx.write(res);
    } catch (e) {
      console.log(`Get Service Provider List Report: ${e}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
