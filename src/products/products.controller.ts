import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  @Get(':id')
  async ProductDeeplink(@Param('id') id: string, @Res() res: any) {
    // setTimeout(function () {
    //   res.redirect('https://onelink.to/pxhr7m');
    // }, 25);
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <head>
          <meta property="og:image" content="https://www.tukanggo.my/assets/img/logo.png">
          <meta property="og:title" content="TukangGo">
          <meta property="og:description" content="Hire the best Tukang!">
        </head>
        <script>
          setTimeout(function () { window.location = "https://onelink.to/pxhr7m"; }, 25);
          window.location = 'tukanggo://product/${id}';
        </script>
      `);
    // return res.redirect(`tukanggo://product/${id}`);
  }
}
