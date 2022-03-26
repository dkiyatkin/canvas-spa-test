/* global Backbone, _ */

(function () {
  'use strict'

  const localStorageKeyName = "dkiyatkin's userList"

  const mainAjaxSync = false // Fetches from the server
  const mainUrl = 'https://jsonplaceholder.typicode.com/users'

  const initData = [{
    name: 'John',
    phone: '+1',
    order: 1
  }, {
    name: 'Jane',
    phone: '+2',
    order: 2
  }, {
    name: 'Smith',
    phone: '+3',
    order: 3
  }, {
    name: 'Tom',
    phone: '+4',
    order: 4
  }]

  const itemFormSelector = 'form[data-app="item-form"]'
  const itemEditBtnSelector = `${itemFormSelector} button[data-app="item-edit-btn"]`
  const itemSaveBtnSelector = `${itemFormSelector} button[data-app="item-save-btn"]`
  const itemRemoveBtnSelector = `${itemFormSelector} button[data-app="item-remove-btn"]`
  const nameFieldSelector = '[data-app="form-name-field"]'
  const phoneFieldSelector = '[data-app="form-phone-field"]'
  const nameInputSelector = 'input[name="name"]'
  const phoneInputSelector = 'input[name="phone"]'
  const rootFormSelector = 'form[data-app="root-form"]'
  const rootListSelector = '[data-app="root-list"]'

  const ItemModel = Backbone.Model.extend({
    defaults: function () {
      return {
        name: '',
        phone: '',
        order: 0
      }
    },

    initialize: function () {
      this.on('change:name', function (event) {
        this.setName(this.attributes.name)
      })
      this.on('change:phone', function (event) {
        this.setPhone(this.attributes.phone)
      })
      this.on('add', function (event) {
        const { name, phone } = this.attributes
        if (name) this.setName(this.attributes.name)
        if (phone) this.setPhone(this.attributes.phone)
      })
    },

    setName: function (name) {
      this.set({ name: name.trim().replace(/\s+/g, ' ') })
    },

    setPhone: function (phone) {
      this.set({ phone: phone.trim().replace(/-{1,}/g, '-').replace(/-$/, '') })
    }
  })

  const ItemCollection = Backbone.Collection.extend({
    model: ItemModel,
    comparator: 'order',
    localStorage: new Backbone.LocalStorage(localStorageKeyName),
    url: mainUrl,

    nextOrder: function () {
      if (!this.length) return 1
      return this.last().get('order') + 1
    }
  })

  const ItemView = Backbone.View.extend({
    formItemTpl: _.template(document.getElementById('form-item-tpl').innerHTML),
    events: {
      [`submit ${itemFormSelector}`]: 'handleItemFormSubmit',
      [`keydown ${itemFormSelector}`]: 'handleItemFormKeydown',
      [`click ${itemEditBtnSelector}`]: 'handleItemEditBtnClick',
      [`click ${itemSaveBtnSelector}`]: 'handleItemSaveBtnClick',
      [`click ${itemRemoveBtnSelector}`]: 'handleItemRemoveBtnClick'
    },

    initialize: function () {
      this.listenTo(this.model, 'destroy', this.remove)
    },

    renderFieldInputs: function (readonly) {
      this.readonly = readonly
      this.nameFieldEl.innerHTML = this.parentView.nameInputTpl({
        name: this.model.get('name'),
        readonly
      })
      this.phoneFieldEl.innerHTML = this.parentView.phoneInputTpl({
        phone: this.model.get('phone'),
        readonly
      })
      this.nameInputEl = this.el.querySelector(nameInputSelector)
      this.phoneInputEl = this.el.querySelector(phoneInputSelector)
    },

    renderReadonlyInputs: function (readonly) {
      this.renderFieldInputs(readonly)
      if (readonly) {
        this.itemSaveBtnEl.classList.add('hidden')
        this.itemEditBtnEl.classList.remove('hidden')
      } else {
        this.itemSaveBtnEl.classList.remove('hidden')
        this.itemEditBtnEl.classList.add('hidden')
      }
    },

    render: function () {
      this.el.innerHTML = this.formItemTpl({})
      this.itemEditBtnEl = this.el.querySelector(itemEditBtnSelector)
      this.itemSaveBtnEl = this.el.querySelector(itemSaveBtnSelector)
      this.nameFieldEl = this.el.querySelector(nameFieldSelector)
      this.phoneFieldEl = this.el.querySelector(phoneFieldSelector)
      this.renderReadonlyInputs(true)
      return this
    },

    cancelOthers: function () {
      this.parentView.childViews
        .filter((oneItemView) => oneItemView !== this)
        .filter((oneItemView) => !oneItemView.readonly)
        .forEach((oneItemView) => oneItemView.renderReadonlyInputs(true))
    },

    handleItemEditBtnClick: function () {
      this.cancelOthers()
      this.renderReadonlyInputs(false)
      const textLength = this.nameInputEl.value.length
      this.nameInputEl.setSelectionRange(textLength, textLength)
      this.nameInputEl.focus()
    },

    handleItemFormSubmit: function (event) {
      event.preventDefault()
      if (this.readonly) return
      this.model.save({
        name: this.nameInputEl.value,
        phone: this.phoneInputEl.value
      }, {
        ajaxSync: mainAjaxSync
      })
      this.renderReadonlyInputs(true)
      this.parentView.trigger('focus')
    },

    handleItemFormKeydown: function (event) {
      if (this.readonly) return
      if (event.which !== 27) return
      this.renderReadonlyInputs(true)
      this.parentView.trigger('focus')
    },

    handleItemRemoveBtnClick: function () {
      this.model.destroy({ ajaxSync: mainAjaxSync })
      this.parentView.trigger('focus')
    }
  })

  const RootView = Backbone.View.extend({
    nameInputTpl: _.template(document.getElementById('name-input-tpl').innerHTML),
    phoneInputTpl: _.template(document.getElementById('phone-input-tpl').innerHTML),
    el: '#root',
    events: {
      [`submit ${rootFormSelector}`]: 'handleRootFormSubmit'
    },

    initialize: function () {
      this.rootListEl = this.el.querySelector(rootListSelector)
      this.nameFieldEl = this.el.querySelector(nameFieldSelector)
      this.phoneFieldEl = this.el.querySelector(phoneFieldSelector)
      this.childViews = []

      this.on('focus', () => this.nameInputEl.focus())

      this.listenTo(mainItemCollection, 'add', this.oneItemRender)
      this.listenTo(mainItemCollection, 'reset', this.allItemsRender)
      this.listenToOnce(mainItemCollection, 'sync', this.render)

      mainItemCollection.fetch({
        reset: true,
        ajaxSync: mainAjaxSync
      }).catch(() => {
        this.render()
      })
    },

    render: function () {
      this.nameFieldEl.innerHTML = this.nameInputTpl({
        name: '',
        readonly: false
      })
      this.phoneFieldEl.innerHTML = this.phoneInputTpl({
        phone: '',
        readonly: false
      })
      this.nameInputEl = this.el.querySelector(`${rootFormSelector} ${nameInputSelector}`)
      this.phoneInputEl = this.el.querySelector(`${rootFormSelector} ${phoneInputSelector}`)
      this.nameInputEl.focus()
    },

    oneItemRender: function (oneItemModel) {
      const oneItemView = new ItemView({ model: oneItemModel })
      oneItemView.parentView = this
      this.childViews.push(oneItemView)
      this.rootListEl.appendChild(oneItemView.render().el)
    },

    allItemsRender: function () {
      this.rootListEl.innerHTML = ''
      this.childViews = []
      mainItemCollection.each(this.oneItemRender, this)
    },

    handleRootFormSubmit: function (event) {
      event.preventDefault()
      mainItemCollection.create({
        name: this.nameInputEl.value,
        phone: this.phoneInputEl.value,
        order: mainItemCollection.nextOrder()
      }, {
        ajaxSync: mainAjaxSync
      })
      this.render()
    }
  })

  const mainItemCollection = new ItemCollection()
  const mainView = new RootView().render()

  if (!mainAjaxSync && (window.localStorage.getItem(localStorageKeyName) === null)) {
    mainItemCollection.add(initData)
    mainItemCollection.models.forEach(oneModel => oneModel.save())
  }

  window.app = {
    ItemModel,
    ItemCollection,
    ItemView,
    RootView,
    mainItemCollection,
    mainView
  }
})()
