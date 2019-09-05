<template>
  <div class="validators">
    <md-card>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-button class="md-simple md-primary md-size-100" :to="{name: 'Create Validator'}">
              <md-icon>create</md-icon>
            </md-button>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-table v-model="validators" :table-header-color="tableHeaderColor">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Address">{{ item.validatorAddress }}</md-table-cell>
                <md-table-cell md-label="Public Key">{{ item.publicKey }}</md-table-cell>
                <md-table-cell md-label="Voting Power">{{ item.votingPower }}</md-table-cell>
                <md-table-cell md-label="Proposer Priority">{{ item.validatorIndex }}</md-table-cell>
                <md-table-cell>
                  <md-button class="md-simple md-primary" :to="{name: 'Edit Validator', params: { address: item.validatorAddress }}">
                    <md-icon>edit</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </div>
        </div>
      </md-card-content>
    </md-card>
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
