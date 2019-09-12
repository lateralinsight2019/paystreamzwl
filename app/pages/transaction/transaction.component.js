/* global angular, console */

import contacts from '../../core/services/contacts.js';

import addContactModal from './add-contact.html';
import editTxCommentModal from './edit-txcomment.html';

export default class TransactionController {

	/* @ngInject */
	constructor($routeParams, History, Modal, Wallet) {

		this.Modal = Modal;

		const network = Wallet.current.network;
		const accountName = Wallet.current.alias;
		const effectId = $routeParams.id;
		const effect = History.effects[accountName][effectId];

		if (effect.type === 'account_created') {
			this.type = 'recv';
			this.code = 'XLM';
			console.log('transaction.component.js: account created asset code ' + this.code);
			this.amount = effect.amount;
			this.counterparty = effect.from;
			this.counterpartyLabel = 'page.transaction.from';
			this.seed = effect.from;
		}

		else if (effect.type === 'account_credited') {
			this.type = 'recv';
			this.code = effect.asset_code;
			console.log('transaction.component.js: account_credited asset code ' + this.code);
			this.amount = effect.amount;
			this.counterparty = effect.from;
			this.counterpartyLabel = 'page.transaction.from';
			this.seed = effect.from;
		}

		else if (effect.type === 'account_debited') {
			this.type = 'send';
			this.code = effect.asset_code;
			console.log('transaction.component.js: account_debited asset code ' + this.code);
			this.amount = effect.amount;
			this.counterparty = effect.to;
			this.counterpartyLabel = 'page.transaction.to';
			this.seed = effect.to;
		}

		else if (effect.type === 'trade') {
			/* eslint-disable camelcase */
			this.type = 'trade';
			this.bought_amount = effect.bought_amount;
			this.bought_code = (effect.bought_asset_type === 'native') ? 'XLM' : effect.bought_asset_code;
			this.sold_amount = effect.sold_amount;
			this.sold_code = (effect.sold_asset_type === 'native') ? 'XLM' : effect.sold_asset_code;
			this.seed = Wallet.current.id;
			/* eslint-enable camelcase */
		}

		const contactName = contacts.lookup(
			this.counterparty,
			network,
			effect.memoType,
			effect.memo
		);
		const contact = contacts.get(contactName);

		this.isWallet = (this.counterparty in Wallet.accounts);
		this.isContact = isContact(contact, effect);
		this.effect = effect;
		this.network = network;

		function isContact(contact, effect) {
			if (!contact) {
				return false;
			}

			//	memo_types has to be "the same"
			//  i.e., non-existant ('undefined' vs 'none'),
			//	or actually equivalent

			if ('memo_type' in contact) {
				if (contact.memo_type !== effect.memoType) {
					return false;
				}
			} else {
				if (effect.memoType !== 'none') {
					return false;
				}
			}

			if (contact.memo !== effect.memo) {
				return false;
			}

			return true;
		}
	}

	addContact() {
		const data = {
			id:      this.counterparty,
			network: this.network
		};

		if (this.type === 'send') {
			if (this.effect.numOps === 1) {
				if (this.effect.memoType !== 'none') {
					/* eslint-disable camelcase */
					data.memo = this.effect.memo;
					data.memo_type = this.effect.memoType;
					/* eslint-enable camelcase */
				}
			}
		}

		this.Modal.show(addContactModal, data);
	}

	buttonText() {
		return this.effect.comment ? 'page.transaction.comment.edit' : 'page.transaction.comment.add';
	}

	editComment() {
		this.Modal.show(editTxCommentModal, this.effect);
	}
}
