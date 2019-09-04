<template>
  <div class="validators">
    <md-table v-model="validators" :table-header-color="tableHeaderColor">
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Address">{{ item.validatorAddress }}</md-table-cell>
        <md-table-cell md-label="Public Key">{{ item.publicKey }}</md-table-cell>
        <md-table-cell md-label="Voting Power">{{ item.votingPower }}</md-table-cell>
        <md-table-cell md-label="Proposer Priority">{{ item.validatorIndex }}</md-table-cell>
        <md-table-cell>
          <md-button class="md-just-icon md-simple md-primary">
            <!--<md-icon>edit</md-icon>-->
            <router-link :to="{name: 'Edit Validator', params: { address: item.validatorAddress }}" class="btn btn-primary">Edit</router-link>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  import axios from 'axios';
  import Validator from '@/models/Validator';

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
        console.log(response.data);
        var list = new Array();

        if(response.data && response.data.length > 0) {

          response.data.forEach(d => {
            var validator = new Validator();
            validator.validatorAddress = d.address;
            validator.publicKey = d.pub_key.value;
            validator.validatorIndex = d.proposer_priority;
            validator.votingPower = d.voting_power;

            list.push(validator);
          });

          this.validators = list;
        }
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
