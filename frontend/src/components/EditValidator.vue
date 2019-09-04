<template>
  <div class="validator-edit">
    <form @submit.prevent="editValidator">
      <md-card>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field>
                <label>Address</label>
                <md-input v-model="validator.validatorAddress" type="text" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field>
                <label>Public Key</label>
                <md-input v-model="validator.publicKey" type="text" disabled></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field>
                <label>Validator Index</label>
                <md-input id="validatorIndex" name="validatorIndex" v-model="validator.validatorIndex" type="text"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field>
                <label>Voting Power</label>
                <md-input id="votingPower" name="votingPower" v-model="validator.votingPower" type="text"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-primary">Reset</md-button>
              <md-button type="submit" class="md-raised md-success">Save</md-button>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';
  import Validator from '@/models/Validator';

  export default {
    name: "ValidatorEdit",
    data() {
      return {
        validator: new Validator()
      }
    },
    created: function() {
      this.getValidator();
    },
    methods: {
      getValidator: function() {
        var validatorAddress = this.$route.params.address;
        this.$http.get('http://localhost:5000/api/v1/validator/' + validatorAddress, {
          headers : {
            'Content-Type' : 'application/json'
          }
        }).then(response => {
          console.log(response.data);
          this.validator = new Validator();
          this.validator.validatorAddress = validatorAddress;
          this.validator.publicKey = response.data.pub_key.value;
          this.validator.validatorIndex = response.data.proposer_priority;
          this.validator.votingPower = response.data.voting_power;
        })
      },
      editValidator: function() {
        var validatorAddress = this.$route.params.address;
        this.$http.patch('http://localhost:5000/api/v1/validator/edit/' + validatorAddress, this.validator, {
          headers : {
            'Content-Type' : 'application/json'
          }
        }).then((response) => {
          this.$router.push({name: 'Validator List'});
        }, (error) => {
          console.log(error);
        })
      }
    }
  }
</script>

<style scoped>

</style>
