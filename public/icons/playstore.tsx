export const PlayStore = ({
    size = '24px',
    color = null, // Single color override
    color1 = '#4db6ac', // Teal (left section)
    color2 = '#dce775', // Light green (top section)
    color3 = '#d32f2f', // Red (bottom section)
    color4 = '#fbc02d'  // Yellow (right section)
  }) => {
    // If color is provided, it overrides individual colors
    const fill1 = color || color1;
    const fill2 = color || color2;
    const fill3 = color || color3;
    const fill4 = color || color4;
  
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 48 48" 
        width={size} 
        height={size}
      >
        <path 
          fill={fill1}
          d="M7.705,4.043C7.292,4.15,7,4.507,7,5.121c0,1.802,0,18.795,0,18.795S7,42.28,7,43.091c0,0.446,0.197,0.745,0.5,0.856l20.181-20.064L7.705,4.043z"
        />
        <path 
          fill={fill2}
          d="M33.237,18.36l-8.307-4.796c0,0-15.245-8.803-16.141-9.32C8.401,4.02,8.019,3.961,7.705,4.043l19.977,19.84L33.237,18.36z"
        />
        <path 
          fill={fill3}
          d="M8.417,43.802c0.532-0.308,15.284-8.825,24.865-14.357l-5.601-5.562L7.5,43.947C7.748,44.038,8.066,44.004,8.417,43.802z"
        />
        <path 
          fill={fill4}
          d="M41.398,23.071c-0.796-0.429-8.1-4.676-8.1-4.676l-0.061-0.035l-5.556,5.523l5.601,5.562c4.432-2.559,7.761-4.48,8.059-4.653C42.285,24.248,42.194,23.5,41.398,23.071z"
        />
      </svg>
    );
  };