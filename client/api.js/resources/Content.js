import Vue from '../init.js'
import {API_ROOT} from '../../config'

export default {
  createNewContent () {
    return Vue.http.get(API_ROOT + 'content/create')
  }
}
