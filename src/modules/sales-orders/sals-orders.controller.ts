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
  Body,
  Post,
  Query,
} from '@nestjs/common';
import * as Xlsx from '@providers/exceljs.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { setFileResHeader } from 'src/utils';
import { GqlRolesGuard, WebJwtAccessAuthGuard } from '@guards/auth.guard';
import { SalesOrdersEntity } from '@entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { exportSalesOrderReportInput } from './sales-orders.input';
// import { GetCustomerCheckoutListDTO } from './dto/get-customer-checkout-list.dto';

@ApiTags('Export Report')
@Controller()
export class SalesOrdersController {
  constructor(
    @InjectRepository(SalesOrdersEntity)
    private readonly salesOrderRepo: Repository<SalesOrdersEntity>,
  ) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export Sales Order List' })
  @UseGuards(WebJwtAccessAuthGuard)
  @Get('reports/sales-order-list')
  async GetProductExcel(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Query() query: exportSalesOrderReportInput,
  ) {
    const { salesOrderStatus, paymentStatus, startDate, endDate } = query;
    try {
      const salesOrderList = await this.salesOrderRepo.query(`
        SELECT so.refNo as refNo, so.createdAt as createdAt,
        so.subtotal as subTotal, so.grandTotal as grandTotal, so.discountTotal as discountTotal,
        p.name as productName, p.type as productType,
        so.salesOrderStatus as salesOrderStatus, so.paymentStatus as paymentStatus,
        sp.fullName as spName, c.fullName as customerName,
        so.address as address, so.placeName as placeName,
        so.addressDetail as addressDetail, so.remark as remark
        FROM sales_orders so
        LEFT JOIN products p ON p.id = so.productId 
        LEFT JOIN service_providers sp ON sp.id = so.serviceProviderId
        LEFT JOIN customers c ON c.id = so.customerId
        WHERE so.deletedAt IS NULL
        ${salesOrderStatus ? `AND so.salesOrderStatus = '${salesOrderStatus}'` : ''}
        ${paymentStatus ? `AND so.paymentStatus = '${paymentStatus}'` : ''}
        ${startDate ? `AND so.createdAt >= '${moment(startDate).startOf('days').format()}'` : ''}
        ${endDate ? `AND so.createdAt <= '${moment(endDate).endOf('days').format()}'` : ''}
        ORDER BY so.createdAt DESC
      `);

      /* --------------------------- Create new Excel -------------------------- */
      const workbook = new Excel.Workbook();
      workbook.created = new Date();

      /* ---------------------------- Create new sheet ---------------------------- */
      const worksheet = workbook.addWorksheet('Sales Order List Report', {
        headerFooter: {
          firstHeader: 'Sales Order List Report',
          firstFooter: momentTz.tz('Asia/Kuala_Lumpur').format('LLLL'),
        },
      });

      /* ----------------------------- Columns Configs ---------------------------- */
      const currency = { ...Xlsx.style.right, ...Xlsx.style.RM };
      const columns: Xlsx.ParseWorkSheetColumn[] = [
        {
          label: 'Ref No.',
          key: 'refNo',
          width: 25,
          style: Xlsx.style.center,
        },
        {
          label: 'Customer Name',
          key: 'customerName',
          width: 25,
          style: currency,
        },
        {
          label: 'Tukang Name',
          key: 'spName',
          width: 25,
          style: currency,
        },
        {
          label: 'Product',
          key: 'productName',
          width: 25,
          style: currency,
        },
        {
          label: 'Product Type',
          key: 'productType',
          width: 25,
          style: currency,
        },
        {
          label: 'Sub Total',
          key: 'subTotal',
          width: 25,
          style: currency,
        },
        {
          label: 'Discount Total',
          key: 'discountTotal',
          width: 25,
          style: currency,
        },
        {
          label: 'Grand Total',
          key: 'grandTotal',
          width: 25,
          style: currency,
        },
        {
          label: 'Sales Order Status',
          key: 'salesOrderStatus',
          width: 25,
          style: currency,
        },
        {
          label: 'Payment Status',
          key: 'paymentStatus',
          width: 25,
          style: currency,
        },
        {
          label: 'Address',
          key: 'address',
          width: 25,
          style: currency,
        },
        {
          label: 'Place Name',
          key: 'placeName',
          width: 25,
          style: currency,
        },
        {
          label: 'Address Detail',
          key: 'addressDetail',
          width: 25,
          style: currency,
        },
        {
          label: 'remark',
          key: 'remark',
          width: 25,
          style: currency,
        },
        { label: 'Created At', key: 'createdAt', width: 25 },
      ];

      Xlsx.parseWorksheetHeader(worksheet, {
        title: 'Sales Order List Report',
        columns,
        // filters,
        paddingBottomRows: 1,
      });

      /* ---------------------------- Add Rows to Excel --------------------------- */
      const rows = [];
      _.map(salesOrderList, (row) => {
        rows.push({
          ...row,
        });
      });
      worksheet.addRows(rows);
      const filename = Xlsx.parseFileName('Sales-Order-list-Report');
      setFileResHeader(res, filename);
      await workbook.xlsx.write(res);
    } catch (e) {
      console.log(`Get Sales Order List Report: ${e}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Export Matching List' })
  @UseGuards(WebJwtAccessAuthGuard)
  @Get('reports/matching-list')
  async GetMatchingExcel(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    try {
      const salesOrderList = await this.salesOrderRepo.query(`
        SELECT so.refNo, som.status, som.createdAt, sp.fullName, sp.companyName, sp.phoneCountryCode, sp.phoneNo, 
        c.fullName AS customerName, c.phoneCountryCode AS customerPhoneCountryCode, c.phoneNo AS customerPhoneNo
        FROM sales_order_matches som
        JOIN sales_orders so
        ON som.salesOrderId = so.id
        JOIN customers c
        ON so.customerId = c.id
        JOIN service_providers sp
        ON som.serviceProviderId = sp.id
        JOIN products p
        ON som.productId = p.id
        WHERE som.deletedAt IS NULL
        ORDER BY som.createdAt DESC
      `);

      /* --------------------------- Create new Excel -------------------------- */
      const workbook = new Excel.Workbook();
      workbook.created = new Date();

      /* ---------------------------- Create new sheet ---------------------------- */
      const worksheet = workbook.addWorksheet('Matching List Report', {
        headerFooter: {
          firstHeader: 'Matching List Report',
          firstFooter: momentTz.tz('Asia/Kuala_Lumpur').format('LLLL'),
        },
      });

      /* ----------------------------- Columns Configs ---------------------------- */
      const currency = { ...Xlsx.style.right, ...Xlsx.style.RM };
      const columns: Xlsx.ParseWorkSheetColumn[] = [
        {
          label: 'Order No',
          key: 'refNo',
          width: 25,
          style: Xlsx.style.center,
        },
        {
          label: 'Status',
          key: 'status',
          width: 25,
        },
        {
          label: 'Created At',
          key: 'createdAt',
          width: 25,
        },
        {
          label: 'Tukang Name',
          key: 'tukangName',
          width: 25,
        },
        {
          label: 'Tukang Phone No.',
          key: 'tukangPhoneNo',
          width: 25,
          style: currency,
        },
        {
          label: 'Customer Name',
          key: 'customerName',
          width: 25,
          style: currency,
        },
        {
          label: 'Customer Phone No.',
          key: 'customerPhoneNo',
          width: 25,
          style: currency,
        },
      ];

      Xlsx.parseWorksheetHeader(worksheet, {
        title: 'Matching List Report',
        columns,
        // filters,
        paddingBottomRows: 1,
      });

      /* ---------------------------- Add Rows to Excel --------------------------- */
      const rows = [];
      _.map(salesOrderList, (row) => {
        rows.push({
          refNo: row.refNo,
          status: row.status,
          createdAt: row.createdAt,
          tukangName: row.companyName || row.fullName,
          tukangPhoneNo: `${row.phoneCountryCode} ${row.phoneNo}`,
          customerName: row.customerName,
          customerPhoneNo: `${row.customerPhoneCountryCode} ${row.customerPhoneNo}`,
        });
      });
      worksheet.addRows(rows);
      const filename = Xlsx.parseFileName('Matching-list-Report');
      setFileResHeader(res, filename);
      await workbook.xlsx.write(res);
    } catch (e) {
      console.log(`Get Matching List Report: ${e}`);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
