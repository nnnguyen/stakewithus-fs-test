<template>
  <div class="validators">
    <md-table v-model="validators" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Address">{{ item.address }}</md-table-cell>
        <md-table-cell md-label="Public Key">{{ item.pub_key.value }}</md-table-cell>
        <md-table-cell md-label="Voting Power">{{ item.voting_power }}</md-table-cell>
        <md-table-cell md-label="Proposer Priority">{{ item.proposer_priority }}</md-table-cell>
        <md-table-cell>
          <md-button class="md-just-icon md-simple md-primary">
            <md-icon>edit</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "ValidatorList",
    props: {
      tableHeaderColor: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        validators: []
      }
    },
    created() {
      axios.get('http://localhost:5000/api/v1/validators').then(response => {
        console.log(response.data.result);
        this.validators = response.data.result.validators;
      })
    }
  }
</script>

<style scoped>
  .validators .md-table-head-container {
    text-align: center !important;;
  }
  .validators .md-table-head-label {
    font-weight: bold !important;
    text-align: center !important;;
  }
  .validators .md-table-cell {
    text-align: left;
  }
  .validators .md-table-cell-container {
    font-size: 11px;
    text-align: left;
  }
</style>
