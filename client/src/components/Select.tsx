import React from 'react'
interface SelectProps{
  options: string[],
  value: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
const Select = ({
   options,
   value,
   onChange
}:SelectProps) => {
  return (
   <select onChange={onChange}>
     <option  value="">{value}</option>
     {options.map((option,index)=>(
         <option key={index} value={option}>{option}</option>
      ))}
   </select>
  )
}

export default Select