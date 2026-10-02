const king= 
`<div class="piece" id="king"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="white" stroke="black" stroke-width="3" stroke-linejoin="round">
    <path d="M43 10h14v10h10v10H57v12h20l-5 12H28l-5-12h20V30H33V20h10z"/>
    <path d="M32 54h36l-4 10H36z"/>
    <path d="M36 64h28l7 20H29z"/>
    <path d="M20 84h60v8H20z"/>
  </g>
</svg>
</div>`
const queen =`<div class="piece" id="queen"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="white" stroke="black" stroke-width="3" stroke-linejoin="round">
    <path d="M18 20l16 18 16-25 16 25 16-18-7 38H25z"/>
    <circle cx="18" cy="18" r="5"/>
    <circle cx="50" cy="11" r="5"/>
    <circle cx="82" cy="18" r="5"/>
    <path d="M28 58h44l-5 12H33z"/>
    <path d="M33 70h34l7 14H26z"/>
    <path d="M20 84h60v8H20z"/>
  </g>
</svg>
</div>`
const bishop =`<div class="piece" id="bishop"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="white" stroke="black" stroke-width="3" stroke-linejoin="round">
    <path d="M50 10c-14 8-20 19-15 31 3 8 9 13 15 18 6-5 12-10 15-18 5-12-1-23-15-31z"/>
    <path d="M43 18l14 25"/>
    <path d="M32 58h36l-4 12H36z"/>
    <path d="M36 70h28l7 14H29z"/>
    <path d="M20 84h60v8H20z"/>
  </g>
</svg>
</div>`
const rook =`<div class="piece" id="rook"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="white" stroke="black" stroke-width="3" stroke-linejoin="round">
    <path d="M25 15h12v10h10V15h12v10h10V15h12v25H25z"/>
    <path d="M30 40h40l-4 28H34z"/>
    <path d="M34 68h32l7 16H27z"/>
    <path d="M20 84h60v8H20z"/>
  </g>
</svg>
</div>`
const knight=` <div class="piece" id="knight"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="white" stroke="black" stroke-width="3" stroke-linejoin="round">
    <path d="M30 84c2-12 7-21 16-28-4-7-9-14-8-24 1-10 8-17 18-22
             10-5 21-4 28 2-8 1-13 5-16 11 8 2 13 8 14 16
             2 14-8 25-18 31H30z"/>
    <circle cx="68" cy="28" r="3" fill="black"/>
    <path d="M35 84h38l7 8H20l7-8z"/>
  </g>
</svg>
</div>`
const pawn = `<div class="piece" id="pawn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g fill="white" stroke="black" stroke-width="3" stroke-linejoin="round">
    <circle cx="50" cy="27" r="14"/>
    <path d="M40 40h20c0 9 5 15 10 22H30c5-7 10-13 10-22z"/>
    <path d="M32 62h36l5 22H27z"/>
    <path d="M20 84h60v8H20z"/>
  </g>
</svg>
</div>`