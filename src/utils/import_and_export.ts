import {utils, writeFile, read} from "xlsx";
import {message} from "antd";
import type {RcFile} from "antd/lib/upload";

//导出excel
export const onExportExcel = (exportCustomerExcelApi: any, params: any, name: any) => {
  exportCustomerExcelApi(params).then( (res: any) =>{
    //将后台返回的Blob数据转换成json
    const reader = new FileReader();
    reader.readAsText(res, 'utf-8');
    reader.addEventListener("loadend", function () { //
      if (typeof reader.result === "string") {

        const result = JSON.parse(reader.result).data;
        try {
          //生成工作表和工作簿
          const worksheet = utils.json_to_sheet(result);
          const workbook = utils.book_new();
          utils.book_append_sheet(workbook, worksheet, name);

          //设置列宽度
          // const max_width = result.reduce((w, r) => Math.max(w, r.name.length), 10);
          worksheet["!cols"] = [ { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 } ];

          //创建一个XLSX文件并命名
          writeFile(workbook, `${name}.xlsx`);
        }catch (e) {
          message.error('导出错误，请联系管理员!')
        }
      }
    });
  }).catch()
}


//导入excel

//读取excel数据
export const onImportExcel = async (file: RcFile, importCustomerExcelApi: any,) => {
  let resData = [{}];// 存储获取到的数据
  // 通过FileReader对象读取文件
  const fileReader = new FileReader();
  fileReader.readAsBinaryString(file);  //二进制
  fileReader.onload = async event => {
    try {
      const result = event.target?.result;
      // 以二进制流方式读取得到整份excel表格对象
      const workbook = read(result, {type: 'binary'});
      // 遍历每张工作表进行读取（这里默认只读取第一张表）
      for (const sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // 利用 sheet_to_json 方法将 excel 转成 json 数据
          resData = utils.sheet_to_json(workbook.Sheets[sheet]);
          break; // 如果只取第一张表，就取消注释这行
        }
      }
      //将读取到的数据传入后台
      const rsp = await importCustomerExcelApi(resData)
      if (rsp && rsp.success) {
        message.success("导入成功")
        return true
      }
      {
        message.error("导入失败")
        return false
      }
    } catch (e) {
      // 这里可以抛出文件类型错误不正确的相关提示
      message.error('文件类型不正确')
    }

  };
  return false
}

