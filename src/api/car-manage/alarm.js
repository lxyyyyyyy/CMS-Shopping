//获取车辆数据模块
import request from '@/utils/request';
//获取列表接口
///admin/product/baseTrademark/{page}/{limit}
export const reqAlarmList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//处理添加品牌
//新增品牌:/admin/product/baseTrademark/save   post请求，携带两个参数：品牌名称和品牌logo
//对于新增的频偏，给服务器传递数据，不需要传递ID，id有服务器生成

//修改频偏 /admin/product/baseTrademark/update put请求  携带三个参数：id、品牌名称、品牌logo

export const reqAddOrUpdate = (tradeMark)=>{
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark});
    }else{
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark});
    }
}
//删除品牌的接口
// /admin/product/baseTrademark/remove/{id} delete

export const reqDeleteCar = (id) => request ({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});