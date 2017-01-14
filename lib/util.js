'use strict'

const _ = require('lodash')

const hexRe = /^[0-9a-fA-F]*$/
const addrRe = /^[0-9a-fA-F]{40}$/
const pubRe = /^[0-9a-fA-F]{64}$/
const privRe = /^[0-9a-fA-F]{128}$/

/**
 * Check if string is proper hex.
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isHex(str) {
  return typeof(str) == 'string' && str.match(hexRe)
}

/**
 * Check if string is proper hex of length 40 (20 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isAddress(str) {
  return typeof(str) == 'string' && str.match(addrRe)
}

/**
 * Check if string is proper hex of length 64 (32 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isPubKey(str) {
  return typeof(str) == 'string' && str.match(pubRe)
}

/**
 * Check if string is proper hex of length 128 (64 bytes).
 *
 * @param {string} str - The string.
 * @returns {boolean}
 */
function isPrivKey(str) {
  return typeof(str) == 'string' && str.match(privRe)
}

/**
 * @type {isHex}
 */
exports.isHex = isHex
/**
 * @type {isAddress}
 */
exports.isAddress = isAddress
/**
 * @type {isPubKey}
 */
exports.isPubKey = isPubKey
/**
 * @type {isPrivKey}
 */
exports.isPrivKey = isPrivKey
