import { useState } from "react";

export const Crousel = () => {

    const [ crouselTransform,  setCrouselTransform ] = useState(0)

    const crouselStyle = { transform: `translateX(${ crouselTransform }%)` };
    
    const crouselHandler = (direction) => {
        if(direction==='right'){
        setCrouselTransform(value =>  value===-66.66? 0 : value - 33.33)
        }
        else if(direction==='left'){
            setCrouselTransform( value=> value===0? -66.66 : value + 33.33 )
        }
    }

    return <section className="crousel-section">
         <div className=" main-div " style={crouselStyle}  > 
        <div className="img-div" ><img src='https://picsum.photos/200' alt='hehe' />
        </div>
        <div className="img-div" ><img src='https://picsum.photos/300' alt='hehe' />
        </div>
        <div className="img-div" ><img src='https://picsum.photos/400' alt='hehe' />
        </div>
     </div>
     <button className="crousel-btn-navigate-left" onClick={()=>crouselHandler('left')} > { '<' } </button>
     <button className="crousel-btn-navigate-right" onClick={()=>crouselHandler('right')} > { '>' }</button>
    </section>
}