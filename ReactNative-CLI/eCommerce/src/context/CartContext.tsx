import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { GroceryItem } from '../data/groceries';

type CartItem = GroceryItem & { quantity: number };

type CartState = {
  items: Record<string, CartItem>;
};

type CartAction =
  | { type: 'ADD'; payload: GroceryItem }
  | { type: 'INCREMENT'; payload: string }
  | { type: 'DECREMENT'; payload: string }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' };

type CartContextValue = {
  items: CartItem[];
  addToCart: (item: GroceryItem) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items[action.payload.id];
      const nextQuantity = existing ? existing.quantity + 1 : 1;
      return {
        items: {
          ...state.items,
          [action.payload.id]: {
            ...action.payload,
            quantity: nextQuantity,
          },
        },
      };
    }
    case 'INCREMENT': {
      const current = state.items[action.payload];
      if (!current) {
        return state;
      }
      return {
        items: {
          ...state.items,
          [action.payload]: {
            ...current,
            quantity: current.quantity + 1,
          },
        },
      };
    }
    case 'DECREMENT': {
      const current = state.items[action.payload];
      if (!current) {
        return state;
      }
      if (current.quantity <= 1) {
        const clone = { ...state.items };
        delete clone[action.payload];
        return { items: clone };
      }
      return {
        items: {
          ...state.items,
          [action.payload]: {
            ...current,
            quantity: current.quantity - 1,
          },
        },
      };
    }
    case 'REMOVE': {
      if (!state.items[action.payload]) {
        return state;
      }
      const clone = { ...state.items };
      delete clone[action.payload];
      return { items: clone };
    }
    case 'CLEAR':
      return { items: {} };
    default:
      return state;
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, { items: {} });

  const addToCart = useCallback(
    (item: GroceryItem) => dispatch({ type: 'ADD', payload: item }),
    [],
  );
  const increment = useCallback(
    (id: string) => dispatch({ type: 'INCREMENT', payload: id }),
    [],
  );
  const decrement = useCallback(
    (id: string) => dispatch({ type: 'DECREMENT', payload: id }),
    [],
  );
  const remove = useCallback(
    (id: string) => dispatch({ type: 'REMOVE', payload: id }),
    [],
  );
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const items = useMemo(() => Object.values(state.items), [state.items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      increment,
      decrement,
      remove,
      clear,
      subtotal,
      totalItems,
    }),
    [items, addToCart, increment, decrement, remove, clear, subtotal, totalItems],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

