//  require.context()是webpack提供的方法
//  这个方法的第一个参数是require的一个文件夹，第二个参数是否遍历子目录，第三个参数是筛选什么类型的文件。
let router = require.context("./main", true, /.vue/);
let arr = [];
// router是一个方法，直接调用会出错，router.keys()是router里的一个静态方法。
// console.log(router.keys()); // ["./roleManage/managementListJXSB.vue"]
router.keys().forEach((key) => {
  let route = key.split(".")[1].split('/')[2]; // 分割字符串。如"./model1.index.vue"
  if (route) {
    arr.push({
      path: route,
      component: router(key).default,
      meta: {
        title: route
      }
    })
  }
});
let router1 = require.context("./main", false, /.vue/);
console.log(router1.keys());
router1.keys().forEach((key) => {
  let route = key.split(".")[1].split('/')[1]; // 分割字符串。如["./userListJXSB.vue"]
  if (route) {
    arr.push({
      path: route,
      component: router1(key).default,
      meta: {
        title: route
      }
    })
  }
});
export default arr
