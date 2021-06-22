<template>
  <div style="margin: auto 100px 20px 100px">
    <table border="1" cellspacing="0" cellpadding="0">
      <tr>
        <td colspan="2" class="title">设备评估报告</td>
      </tr>
      <tr class="cate">
        <td colspan="2">评估信息</td>
      </tr>
      <tr>
        <td class="td-left">委托方</td>
        <td>{{tableData.client}}</td>
      </tr>
      <tr>
        <td class="td-left">评估人员</td>
        <td>{{tableData.name}}</td>
      </tr>
      <tr>
        <td class="td-left">所属公司</td>
        <td>{{tableData.agency}}</td>
      </tr>
      <tr>
        <td class="td-left">评估时间</td>
        <td>{{tableData.time | formatDate2}}</td>
      </tr>
      <tr>
        <td class="td-left">评估金额</td>
        <td>{{tableData.price}}元</td>
      </tr>
      <tr class="cate">
        <td colspan="2">设备信息</td>
      </tr>
      <tr>
        <td class="td-left">名称</td>
        <td>{{tableData.mechanicsName}}</td>
      </tr>
      <tr>
        <td class="td-left">编号</td>
        <td>{{tableData.mechanicsNo}}</td>
      </tr>
      <tr>
        <td class="td-left">规格</td>
        <td>{{tableData.mechanicsSpecifications}}</td>
      </tr>
      <tr>
        <td class="td-left">生产日期</td>
        <td>{{tableData.mechanicsProductionTime | formatDate2}}</td>
      </tr>
      <tr class="cate">
        <td colspan="2">评估参数</td>
      </tr>
      <tr>
        <td class="td-left">生产年份</td>
        <td>{{tableData.mechanicsProductionYear}}年</td>
      </tr>
      <tr>
        <td class="td-left">使用状况</td>
        <td v-if="tableData.usageStatus==0">优</td>
        <td v-else-if="tableData.usageStatus==1">良</td>
        <td v-else-if="tableData.usageStatus==2">一般</td>
        <td v-else-if="tableData.usageStatus==3">差</td>
      </tr>
      <tr>
        <td class="td-left">品牌价值</td>
        <td v-if="tableData.brandValue==0">优</td>
        <td v-else-if="tableData.brandValue==1">良</td>
        <td v-else-if="tableData.brandValue==2">一般</td>
        <td v-else-if="tableData.brandValue==3">差</td>
      </tr>
      <tr>
        <td class="td-left">有无改装</td>
        <td v-if="tableData.refit==0">无</td>
        <td v-else-if="tableData.refit==1">有</td>
      </tr>
      <tr>
        <td colspan="2">评估结果</td>
      </tr>
      <tr>
        <td colspan="2">
          设备生产年份{{tableData.mechanicsProductionYear}}年，{{tableData.usageStatusStr}}，{{tableData.brandValueStr}},
          {{tableData.refitStr}},设备价值评估为<span class="text">{{tableData.price}}</span>元，大写：人民币<span class="text">{{tableData.priceChn}}</span>。
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: "eqAssessReport",
    props: ['tableData'],
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .title {
    background: rgb(24, 79, 120);
    color: rgb(255, 255, 255);
    height: 50px;
    font-size: 18px;
  }

  .cate {
    text-align: center;
  }

  .td-left {
    width: 200px;
    background-color: rgb(218, 230, 239);
  }

  .text {
    color: rgb(227, 46, 41);
    padding-bottom: 1px;
    border-bottom: 1px solid black;
  }

  tr {
    height: 40px;
    line-height: 40px;
  }
</style>
