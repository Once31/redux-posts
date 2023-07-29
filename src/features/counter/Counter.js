import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, reset, incrementByAmount, incrementAsync } from './counterSlice';
import style from './Counter.css'
const Counter = () => {
    const [incrementCount , setIncrementCount] = useState(2)
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(reset())}>Reset</button>
            <h1>{count}</h1>
            <input type="text" value={incrementCount} onChange={e => setIncrementCount(e.target.value)}/>
            <button onClick={() => dispatch(incrementByAmount(Number(incrementCount) || 0))}>Increment By Value</button>
            <button className="asyncButton" onClick={() => dispatch(incrementAsync(Number(incrementCount) || 0))}>Async Increment By Value</button>
        </div>
    )
}

export default Counter;