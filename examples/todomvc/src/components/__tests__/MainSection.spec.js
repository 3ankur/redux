import React from 'react'
import { shallow } from 'enzyme'
import MainSection from '../MainSection'
import TodoItem from '../TodoItem'
import Footer from '../Footer'
import { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } from '../../constants/TodoFilters'

const todos = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  },
  {
    text: 'Run the tests',
    completed: true,
    id: 1
  }
]

const setup = propsOverrides => {
  const props = Object.assign({
    todos,
    actions: {
      editTodo: jest.fn(),
      deleteTodo: jest.fn(),
      completeTodo: jest.fn(),
      completeAll: jest.fn(),
      clearCompleted: jest.fn()
    }
  }, propsOverrides)

  const wrapper = shallow(<MainSection {...props} />)

  return {
    props,
    wrapper,
    toggle: wrapper.find('.toggle-all'),
    footer: wrapper.find(Footer),
  }
}

describe('MainSection Component', () => {
  test('render', () => {
    const { wrapper } = setup()
    expect(wrapper).toMatchSnapshot()
  })

  describe('toggle all input', () => {
    test('checked if all todos completed', () => {
      const { toggle } = setup({ todos: [todos[1]] })
      expect(toggle.props().checked).toBe(true)
    })

    test('on change calls completeAll', () => {
      const { toggle, props } = setup()
      toggle.props().onChange({})
      expect(props.actions.completeAll).toBeCalled()
    })
  })

  describe('todo list', () => {
    const testFilteredTodos = (filter, todos) => {
      test(`render ${filter} items`, () => {
        const { wrapper, footer } = setup()
        footer.props().onShow(filter)
        expect(wrapper.find(TodoItem).map(node => node.props().todo)).toEqual(todos)
      })
    }

    testFilteredTodos(SHOW_ALL, todos)
    testFilteredTodos(SHOW_ACTIVE, [todos[0]])
    testFilteredTodos(SHOW_COMPLETED, [todos[1]])
  })

  describe('footer', () => {
    test('render', () => {
      const { footer } = setup()
      expect(footer.type()).toBe(Footer)
      expect(footer.props()).toMatchObject({
        completedCount: 1,
        activeCount: 1,
        filter: SHOW_ALL,
      })
    })

    test('onClearCompleted calls clearCompleted', () => {
      const { footer, props } = setup()
      footer.props().onClearCompleted()
      expect(props.actions.clearCompleted).toBeCalled()
    })
  })
})
