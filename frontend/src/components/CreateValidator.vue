<template>
  <div class="validator-create">
    <form @submit.prevent="createValidator">
      <md-card>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field :class="getValidationClass('validatorAddress')">
                <label>Address</label>
                <md-input id="validatorAddress" name="validatorAddress" v-model="validator.validatorAddress" type="text"></md-input>
                <span class="md-error" v-if="!$v.validator.validatorAddress.required">Validator Address is required</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100 md-size-33">
              <md-field :class="getValidationClass('publicKey')">
                <label>Public Key</label>
                <md-input id="publicKey" name="publicKey" v-model="validator.publicKey" type="text"></md-input>
                <span class="md-error" v-if="!$v.validator.publicKey.required">Public Key is required</span>
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
  import { required, maxLength } from 'vuelidate/lib/validators';
  import Validator from '@/models/Validator';

  export default {
    name: "ValidatorCreate",
    data() {
      return {
        validator: new Validator()
      }
    },
    validations: {
      validator: {
        validatorAddress: {
          required
        },
        publicKey: {
          required
        },
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
    methods: {
      createValidator: function() {
        this.$v.validator.$touch();
        if(this.$v.validator.$error) return;

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
