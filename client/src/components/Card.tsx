import React from 'react'
interface CardProps{
  image: string;
  title: string;
  description: string;
  tags?: string[],
  link: string
}
const Card = ({
  image,
  title,
  description,
  tags,
  link
}: CardProps)  => {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <img src={image} alt={title} className='w-full h-48 object-cover' />
      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-2'>{title}</h3>
        <p className='text-gray-600 mb-4'>{description}</p>
        <div className='flex flex-wrap gap-2 mb-4'>
          {tags?.map((tag, index) => (
            <span key={index} className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded'>
              {tag}
            </span>
          ))}
        </div>
        <a href={link} className='text-blue-500 hover:text-blue-700 font-medium'>
          Learn More
        </a>
      </div>
    </div>
  )
}

export default Card