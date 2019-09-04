<template>
  <div class="validator-create">
    <form @submit.prevent="createValidator">
      <md-card>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field>
                <label>Address</label>
                <md-input id="validatorAddress" name="validatorAddress" v-model="validator.validatorAddress" type="text"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field>
                <label>Public Key</label>
                <md-input id="publicKey" name="publicKey" v-model="validator.publicKey" type="text"></md-input>
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
              <md-button class="md-primary" @click="resetForm">Reset</md-button>
              <md-button type="submit" class="md-raised md-success" >Save</md-button>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
  import Validator from '@/models/Validator';

  export default {
    name: "ValidatorCreate",
    data() {
      return {
        validator: new Validator()
      }
    },
    methods: {
      createValidator: function() {
        var validatorAddress = this.$route.params.address;
        this.$http.post('http://localhost:5000/api/v1/validator/create', this.validator, {
          headers : {
            'Content-Type' : 'application/json'
          }
        }).then((response) => {
          this.$router.push({name: 'Validator List'});
        }, (error) => {
          console.log(error);
        })
      },
      resetForm: function() {
        this.validator = new Validator();
      }
    }
  }
</script>

<style scoped>

</style>
