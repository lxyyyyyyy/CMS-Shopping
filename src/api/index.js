//将模块请求接口函数统一暴露
import * as alarm from './car-manage/alarm'
import * as info from './car-manage/info'
import * as spu from './car-manage/spu'
import * as sku from './car-manage/sku'

import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'

//对外暴露
export default {
    alarm,
    info,
    spu,
    sku,
    user,
    role,
    permission
}