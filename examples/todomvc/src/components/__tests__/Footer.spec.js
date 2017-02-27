import React from 'react'
import { shallow } from 'enzyme'
import Footer from '../Footer'
import { SHOW_ALL, SHOW_ACTIVE } from '../../constants/TodoFilters'

const setup = propOverrides => {
  const props = Object.assign({
    completedCount: 0,
    activeCount: 0,
    filter: SHOW_ALL,
    onClearCompleted: jest.fn(),
    onShow: jest.fn()
  }, propOverrides)

  const wrapper = shallow(<Footer {...props} />)

  return {
    props,
    wrapper,
    count: wrapper.find('.todo-count'),
    filters: wrapper.find('.filters'),
    clear: wrapper.find('.clear-completed'),
  }
}

describe('components', () => {
  describe('Footer', () => {
    test('render', () => {
      const { wrapper } = setup()
      expect(wrapper).toMatchSnapshot()
    })

    describe('count', () => {
      test('when active count 0', () => {
        const { count } = setup({ activeCount: 0 })
        expect(count.text()).toEqual('No items left')
      })

      test('when active count above 0', () => {
        const { count } = setup({ activeCount: 1 })
        expect(count.text()).toEqual('1 item left')
      })
    });

    describe('filters', () => {
      test('on click calls onShow', () => {
        const { filters, props } = setup()
        filters.find('a').at(1).simulate('click')
        expect(props.onShow).toBeCalledWith(SHOW_ACTIVE)
      })
    });

    describe('clear button', () => {
      test('no clear button when no completed todos', () => {
        const { clear } = setup({ completedCount: 0 })
        expect(clear.exists()).toBe(false)
      })

      test('on click calls onClearCompleted', () => {
        const { clear, props } = setup({ completedCount: 1 })
        expect(clear.text()).toEqual('Clear completed')
        clear.simulate('click')
        expect(props.onClearCompleted).toBeCalledWith()
      })
    })
  })
})
