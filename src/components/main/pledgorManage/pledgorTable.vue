<template>
  <div>
    <el-table :data="tableData"
              border
              stripe
              style="width: 100%" :header-cell-style="{'text-align':'center'}"
              :cell-style="{'text-align':'center'}">
      <el-table-column prop="businessName" label="公司名称" width="160"></el-table-column>
      <el-table-column prop="industry" label="支持产业" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.industry===0">汽车</p>
          <p v-else-if="scope.row.industry===1">机械设备</p>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="法定代表人" width="100"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="idCardNo" label="身份证" width="180"></el-table-column>
      <el-table-column prop="businessAddress" label="地址" width="200"></el-table-column>
      <el-table-column prop="agencyAbbreviation" label="监管仓" width="100"></el-table-column>
      <el-table-column prop="creationTime" label="添加时间" width="180">
        <template slot-scope="scope">
          {{scope.row.creationTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="80">
        <template slot-scope="scope">
          <p v-if="scope.row.state===0">待完善</p>
          <p v-else-if="scope.row.state===1">待配置</p>
          <p v-else-if="scope.row.state===2">已完成</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state===0" @click="improveCustomer(scope.$index, scope.row)" type="text"
                     size="small">完善客户
          </el-button>
          <el-button v-if="scope.row.state===1 ||scope.row.state===2" @click="configureProcess(scope.$index, scope.row)"
                     type="text"
                     size="small">配置流程
          </el-button>
          <el-button @click="pledgorMgt(scope.$index, scope.row)" type="text" size="small">出质人管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <czr-manager :drawerVisible="czrDrawerVisible" :customerId="customerId"/>
    <ProcessConfig :drawerVisible="proConVisible" :rowData="rowdata"/>
  </div>
</template>

<script>
  import Pager from '../../parts/Pager'
  import czrManager from './czrManager'
  import ProcessConfig from './processConfig'


  export default {
    name: "pledgorTable",
    props: ['tableData', 'currentTab'],
    components: {Pager, czrManager, ProcessConfig},
    data() {
      return {
        czrDrawerVisible: false,
        proConVisible: false,
        customerId: '',
        rowdata: {},
      }
    },
    methods: {
      configureProcess(index, rowData) {
        console.log(index, rowData);
        this.proConVisible = new Date().getTime();
        this.customerId = rowData.id;
        this.rowdata = JSON.parse(JSON.stringify(rowData));
      },
      pledgorMgt(index, rowData) {
        this.czrDrawerVisible = new Date().getTime();
        this.rowdata = JSON.parse(JSON.stringify(rowData));
      },
      async improveCustomer(index, rowData) { //完善客户
        let rd = JSON.parse(JSON.stringify(rowData));
        await this.$axios.get('baseInfo/customer/info/' + rowData.id).then((response) => {
          // console.log('resp', response.data.data);
          rd.address = response.data.data.businessVo.address;
          rd.years = response.data.data.businessVo.years;
          rd.idCardNationalUrl = response.data.data.idCardNationalUrl ? response.data.data.idCardNationalUrl : '';
          rd.idCardPortraiUrlt = response.data.data.idCardPortraiUrlt ? response.data.data.idCardPortraiUrlt : '';
          rd.licenseUrl = response.data.data.businessVo.licenseUrl ? response.data.data.businessVo.licenseUrl : '';
        });
        console.log('improve', rd);
        this.$emit('returnRowData', rd);
      }
    }

  }
</script>

<style scoped>

</style>
