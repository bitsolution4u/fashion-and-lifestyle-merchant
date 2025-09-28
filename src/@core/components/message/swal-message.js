const { default: Swal } = require("sweetalert2");


exports.swalMessage = ({message})=>{
    Swal.fire({
        icon: 'success',
        title: `${message}`,
        showClass: {
          popup: 'animate__animated animate__bounceInDown', // Add a CSS animation class for the popup
        },
        hideClass: {
          popup: 'animate__animated animate__bounceOutUp', // Add a CSS animation class when hiding the popup
        },
        showConfirmButton: false,
        timer: 1500,
      });
}


exports.swalMessageError = ({message})=>{
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: `${message}`,
    footer: '<a href="">Please check all the field again!</a>',
    confirmButtonColor: '#d33',
  })
}