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
              <md-field :class="getValidationClass('validatorIndex')">
                <label>Validator Index</label>
                <md-input id="validatorIndex" name="validatorIndex" v-model="validator.validatorIndex" type="text"></md-input>
                <span class="md-error" v-if="!$v.validator.validatorIndex.required">Validator Index is required</span>
                <span class="md-error" v-else-if="!$v.validator.validatorIndex.maxlength">Max length is 19 characters</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-50">
              <md-field :class="getValidationClass('votingPower')">
                <label>Voting Power</label>
                <md-input id="votingPower" name="votingPower" v-model="validator.votingPower" type="text"></md-input>
                <span class="md-error" v-if="!$v.validator.votingPower.required">Voting Power is required</span>
                <span class="md-error" v-else-if="!$v.validator.votingPower.maxlength">Max length is 17 characters</span>
              </md-field>
            </div>
            <div class="md-layout-item md-size-100 text-right">
              <md-button class="md-primary" @click="resetForm">Reset</md-button>
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
  import { required, maxLength } from 'vuelidate/lib/validators';
  import Validator from '@/models/Validator';

  export default {
    name: "ValidatorEdit",
    data() {
      return {
        validator: new Validator(),
        originalValidator: new Validator()
      }
    },
    validations: {
      validator: {
        validatorIndex: {
          required,
          maxLength: maxLength(19)
        },
        votingPower: {
          required,
          maxLength: maxLength(17)
        }
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

          this.originalValidator = {...this.validator};
        })
      },
      editValidator: function() {
        this.$v.validator.$touch();
        if(this.$v.validator.$error) return;

        var validatorAddress = this.$route.params.address;
        this.$http.patch('http://localhost:5000/api/v1/validator/edit/' + validatorAddress, this.validator, {
          headers : {
            'Content-Type' : 'application/json'
          }
        }).then((response) => {
          this.$router.push({name: 'Validator List'});
          this.originalValidator = {...this.validator};
        }, (error) => {
          console.log(error);
        })
      },
      resetForm: function() {
        this.validator = {...this.originalValidator};
      },
      getValidationClass: function(fieldName) {
        const field = this.$v.validator[fieldName];
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
