import {
  TEST,
  STORE_CURRENT_TABS,
  CHECK_SERVER_START,
  CHECK_SERVER_END,
  BACKEND_URL,
  CHANGE_SELECT,
  CHANGE_SELECT_ALL,
  SETTINGS_EDIT,
  SETTINGS_EDIT_CANCEL
} from '../constants'

import { createSocket } from './socket'

import axios from 'axios'

export function testEvent() {
  return {
    type: TEST,
    payload: 'test'
  }
}

export function settingsEdit(params) {
  return {
    type: SETTINGS_EDIT
  }
}

export function settingsEditCancel(params) {
  return {
    type: SETTINGS_EDIT_CANCEL
  }
}

export function tabChangeSelectAll(params) {
  return {
    type: CHANGE_SELECT_ALL,
    payload: params
  }
}

export function tabChangeSelect(params) {
  return {
    type: CHANGE_SELECT,
    payload: params
  }
}

export function storeCurrentTabs(params) {
  return {
    type: STORE_CURRENT_TABS,
    payload: { windowTabs: params }
  }
}

function startCheckServer() {
  return {
    type: CHECK_SERVER_START,
    payload: null
  }
}

function endCheckServer(data) {
  return dispatch => {
    const { status, params } = data
    if (status === 'ok') {
      dispatch(createSocket(params.token, params.channelId))
    }

    dispatch({
      type: CHECK_SERVER_END,
      payload: { data: data }
    })
  }
}

export function checkServer() {
  return dispatch => {
    dispatch(startCheckServer())

    axios
      .get(`${BACKEND_URL}/api/check`, { withCredentials: true })
      .then(response => {
        dispatch(endCheckServer(response.data))
      })
      .catch(error => {
        dispatch(endCheckServer({ status: 'error', params: error }))
      })
  }
}
