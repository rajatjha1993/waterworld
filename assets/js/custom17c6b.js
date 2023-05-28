var baseurl = "https://pearlwater.in/";
function validateEmail(e) {
    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(e);
}
function validatePhone(e) {
    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(e);
}
function validatePassword(e) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(e);
}
function checkspecialchars(e) {
    return /^[a-zA-Z0-9 ]*$/.test(e);
}
function getCodeBoxElement(index) {
        return document.getElementById('codeBox' + index);
    }
    function onKeyUpEvent(index, event) {
        const eventCode = event.which || event.keyCode;
        if (getCodeBoxElement(index).value.length === 1) {
          if (index !== 6) {
            getCodeBoxElement(index+ 1).focus();
        } else {
            getCodeBoxElement(index).blur();
            // Submit code
            console.log('submit code ');
            $("#verify_btn").show();
        }
    }
    if (eventCode === 8 && index !== 1) {
      getCodeBoxElement(index - 1).focus();
      $("#verify_btn").hide();

  }
}
function onFocusEvent(index) {
    for (item = 1; item < index; item++) {
      const currentElement = getCodeBoxElement(item);
      if (!currentElement.value) {
          currentElement.focus();
          break;
      }
  }
}
function register_verify_send_otp(btn){
    var pass=$("#password").val();
    var con_pass=$("#conpass").val();
    var email=$("#email").val();
    var phone=$("#phone").val();
    if(email=='' || !validateEmail(email)){
        alert("Please enter your Email in valid format!");
        return false;
    }
    else if(phone.length!=10 || !validatePhone(phone)){
        alert("Please enter 10 digit mobile number without 0 or +91 !");
        return false;
    }
    else if(pass==''){
        alert("Please enter your Password!");
        return false;
    }
    else if(pass!=con_pass){
        alert("Passwords didn't matched!");
        return false;
    }
    else{
       $(btn).html("Sending OTP...");
       var uri="https://2factor.in/API/V1/8b0ed9a9-3dfb-11eb-83d4-0200cd936042/SMS/"+phone+"/AUTOGEN/Pearl";
    $.ajax({
      crossDomain: true,
      url: uri,
      type: "GET",
      data: {},
      success: function(data){
        console.log(data);
        if(data["Status"]=="Success"){
           $(btn).html("OTP Sent");
           $("#myModal").modal('toggle');
           $("#token").val(data["Details"]);
        $("#invalid_num").text("");
       }
       else{
        $("#invalid_num").text("Please check if your phone number is valid.");
       $(btn).html("REGISTER");
    }
},
error:function(error){
  console.log(error);
 $("#invalid_num").text("Please check if your phone number is valid.");
       $(btn).html("REGISTER");
}
});
}
}
function verify_otp(btn){
 $(btn).html("Verifying...");
    var code=$("#codeBox1").val()+$("#codeBox2").val()+$("#codeBox3").val()+$("#codeBox4").val()+$("#codeBox5").val()+$("#codeBox6").val();
    console.log(code);
    var token = $("#token").val(); 
    var uri="https://2factor.in/API/V1/8b0ed9a9-3dfb-11eb-83d4-0200cd936042/SMS/VERIFY/"+token+"/"+code;
    $.ajax({
      crossDomain: true,
      url: uri,
      type: "GET",
      data: {},
      success: function(data){
        console.log(data);
        if(data["Status"]=="Success"){
           $(btn).html("OTP Verified");
          //$("#reg_form").submit();
          var pass=$("#password").val();
          var email=$("#email").val();
          var phone=$("#phone").val();
          $.ajax({
            url:baseurl+"register/adduser",
            method:"POST",
            data:{email:email,phone:phone,pass:pass},
            dataType:'json',
            cache:false,
            beforeSend:function(){
              $(btn).html('wait...');             
            },
            success:function(data){
               if(data.ok==1){
                window.location.href=baseurl+'login';
                }else{
                  alert(data.err);
                  $(btn).html("Verify");
                }
            } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
          });
}
else{
 $(btn).html("OTP Not Verified");
 $(btn).html("Invalid OTP");
}
},
error:function(error){
  console.log(error);
  $(btn).html("OTP Not Verified");
 $(btn).html("Invalid OTP");
}
});
}
function check_availibility(){
  var pin=$("#pincode").val();
  if(pin.length!=6){
    $("#error").html('Please enter 6 digit pincode');
  }else{    
    $.ajax({
      url:baseurl+"cart/checkpincode",
      method:"POST",
      data:{pincode:pin},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){
           $("#avail_details").html(data.msg);
           $("#avail_details").css('color','green');
           $("#cart_enabled").show();
          $(document.body).css({'cursor' : 'default'});
          }else{
            $("#avail_details").html(data.err);
            $("#avail_details").css('color','red');
            $("#cart_enabled").hide();
            $(document.body).css({'cursor' : 'default'});
          }
      } /*,error:function(e,a,r){alert(e.status),alert(a),alert(r)}*/
    });
  }
}
/*$("body").hover(function(){   
  var pin=$("#pincode").val();
  if(pin.length==6){
    $.ajax({
      url:baseurl+"cart/checkpincode",
      method:"POST",
      data:{pincode:pin},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){
           $("#avail_details").html(data.msg);
          $(document.body).css({'cursor' : 'default'});
          }else{
            alert(data.err);
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
  });*/
  function add_to_cart(){
    var proqty=$("#pro_qty").val(),
     pin=$("#pincode").val(),
     pid=$("#pid").val();
     if(proqty<1){
      $("#error").html('Please select atleat 1 quantity');
     }else if(pin.length!=6){
      $("#error").html('Please enter 6 digit pincode');
     }else{
      $("#error").html('');
      $.ajax({
        url:baseurl+"cart/add_to_cart",
        method:"POST",
        data:{proqty:proqty,pid:pid},
        dataType:'json',
        cache:false,
        beforeSend:function(){
          $(document.body).css({'cursor' : 'wait'});               
        },
        success:function(data){
           if(data.ok==1){
             //$("#avail_details").html(data.msg);
             $(".nav-right").load(location.href + " .nav-right");
             $("#addcrt").html('ADDED TO CART');
             $('#snackbars').modal('show');
             $("#snackbars").html(data.msg);
             setTimeout(function(){ 
              $('#snackbars').modal('hide');}, 3000);
            $(document.body).css({'cursor' : 'default'});
            }else{
              alert(data.err);
              $(document.body).css({'cursor' : 'default'});
            }
        } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
      });
     }
  }
  function add_one_qty_to_cart_and_shop(){
    var proqty=$("#pro_qty").val(),
    pin=$("#pincode").val(),
    pid=$("#pid").val();
    if(proqty<1){
     $("#error").html('Please select atleat 1 quantity');
    }else if(pin.length!=6){
     $("#error").html('Please enter 6 digit pincode');
    }else{
     $("#error").html('');
     $.ajax({
       url:baseurl+"cart/add_to_cart",
       method:"POST",
       data:{proqty:proqty,pid:pid},
       dataType:'json',
       cache:false,
       beforeSend:function(){
         $(document.body).css({'cursor' : 'wait'});               
       },
       success:function(data){
          if(data.ok==1){
            //$("#avail_details").html(data.msg);
            $(".nav-right").load(location.href + " .nav-right");
            $("#addcrt").html('ADDED TO CART');
            $('#snackbars').modal('show');
            $("#snackbars").html(data.msg);
            setTimeout(function(){ 
             $('#snackbars').modal('hide');}, 3000);
           $(document.body).css({'cursor' : 'default'});
           window.location.href=baseurl+'checkout';
           }else{
             alert(data.err);
             $(document.body).css({'cursor' : 'default'});
           }
       } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
     });
    }
  }
  $("#login_page").click(function(){
    var email=$.trim($("#email").val()),
    password=$.trim($("#password").val()),
    t = window.location.href.slice(window.location.href.indexOf("=") + 1).split("&");
    /*if(email.length==0 || !validateEmail(email) || password.length==0){
      if(email.length==0 || !validateEmail(email)){
        var htmlerr='Please enter correct email format';
      }else if(password.length==0){
        var htmlerr='Please enter password';
      }
      $("#loginerror").html(htmlerr);
    }*/
    if(!$.isNumeric(email) && !validateEmail(email)){
        var htmlerr='Please enter correct email format';
        $("#loginerror").html(htmlerr);
      }else if($.isNumeric(email) && !validatePhone(email)){
        var htmlerr='Please enter 10 digit mobile number without 0 or +91 !';
        $("#loginerror").html(htmlerr);
      }else if(email.length==0){
        var htmlerr='Please enter Email Address or Phone Number';
        $("#loginerror").html(htmlerr);
      }
      else if(password.length==0){
        var htmlerr='Please enter password';
        $("#loginerror").html(htmlerr);
      }
    else{
      $.ajax({
        url:baseurl+"login/userlogin",
        method:"POST",
        data:{email:email,password:password},
        dataType:'json',
        cache:false,
        beforeSend:function(){
          $("#login_page").html('wait...');
          $("#loginerror").html("");                
        },
        success:function(data){
           if(data.ok==1){
            if(t=='checkout'){
              window.location.href=baseurl+t;
          }else{
            window.location.href=baseurl+'';
          }
            }else{
              $("#loginerror").html(data.err);
              $("#login_page").html("Login");
            }
        } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
      });
    }
  });
  function remove_from_cart(id){
    if(confirm("Are you sure ?")){
      $.ajax({
        url:baseurl+"cart/remove_from_cart",
        method:"POST",
        data:{id:id},
        dataType:'json',
        cache:false,
        beforeSend:function(){
          $(document.body).css({'cursor' : 'wait'});               
        },
        success:function(data){
           if(data.ok==1){
             $(".nav-right").load(location.href + " .nav-right");
             $(".cart-table").load(location.href + " .cart-table");
             $(".select-total").load(location.href + " .select-total");
             $(".cart-total").load(location.href + " .cart-total");
             $(".order-table").load(location.href + " .order-table");
             $('#snackbars').modal('show');
             $("#snackbars").html(data.msg);
             setTimeout(function(){ 
              $('#snackbars').modal('hide');}, 3000);
            $(document.body).css({'cursor' : 'default'});
            }else{
              alert(data.err);
              $(document.body).css({'cursor' : 'default'});
            }
        } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
      });
    }
  }
  function updateQty(id){
    var qty=$.trim($("#qty"+id).val());
    if(!$.isNumeric(qty)){
      alert('An Error occured!');
    }else{
      $.ajax({
        url:baseurl+"cart/update_cart_qty",
        method:"POST",
        data:{id:id,qty:qty},
        dataType:'json',
        cache:false,
        beforeSend:function(){
          $(document.body).css({'cursor' : 'wait'});               
        },
        success:function(data){
           if(data.ok==1){
             $(".nav-right").load(location.href + " .nav-right");
             $(".cart-table").load(location.href + " .cart-table");
             $(".select-total").load(location.href + " .select-total");
             $(".cart-total").load(location.href + " .cart-total");
             $('#snackbars').modal('show');
             $("#snackbars").html(data.msg);
             setTimeout(function(){ 
              $('#snackbars').modal('hide');}, 3000);
            $(document.body).css({'cursor' : 'default'});
            }else{
              alert(data.err);
              $(document.body).css({'cursor' : 'default'});
            }
        } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
      });
    }
  }
$("#zip").keyup(function(){
  var p=$.trim($("#zip").val());
  if(p.length==6 && $.isNumeric(p)){
    $(document.body).css({'cursor' : 'wait'});
   $.get("https://api.postalpincode.in/pincode/"+p, function(data, status){
       if(data[0]['Status']=='Success'){
           var a=data[0]['PostOffice'];
           $("#city").val(a[0]['District']);
           $("#state").val(a[0]['State']);
           $("#country").val(a[0]['Country']);
           $("#avail_details").html('');
           $(document.body).css({'cursor' : 'default'});
           /**get availability for checkout */
           $.ajax({
            url:baseurl+"cart/checkpincode",
            method:"POST",
            data:{pincode:p},
            dataType:'json',
            cache:false,
            beforeSend:function(){
              $(document.body).css({'cursor' : 'wait'});
              $('#myModal1').modal('show');
              $("#place_order").hide();
            },
            success:function(data){
               if(data.ok==1){
                 $("#avail_details").html(data.msg);
                 $("#cart_enabled").show();
                 $(".order-table").load(location.href + " .order-table");                 
                 $("#cc").val('');
                 $("#cc_error").html('');
                 $("#place_order").show();
                $(document.body).css({'cursor' : 'default'});
                setTimeout(function(){ 
                  $('#myModal1').modal('hide');}, 3000);
                }else{
                  $("#avail_details").html(data.err);
                  $("#cart_enabled").hide();
                  $(document.body).css({'cursor' : 'default'});
                }
            } /*,error:function(e,a,r){alert(e.status),alert(a),alert(r)}*/
          });
           /**end */
       }else{
           alert('Please enter valid pincode');
           $("#city").val('');
           $("#state").val('');
           $("#place_order").hide();
       }
     });
  }else if(p.length!=6 || !$.isNumeric(p)){
      $("#avail_details").html('Please enter correct pincode in correct format');
      $.trim($("#city").val(''));
      $.trim($("#state").val(''));
      $.trim($("#country").val(''));
      $("#place_order").hide();
  }
 });
 $("#profile_update").click(function(){
   var name=$.trim($("#name").val()),
       add1=$.trim($("#address1").val()),
       add2=$.trim($("#address2").val()),
       zip=$.trim($("#zip").val()),
       city=$.trim($("#city").val()),
       state=$.trim($("#state").val()),
       country=$.trim($("#country").val()),
       dob=$.trim($("#dob").val());
       if(name.length==0 || !checkspecialchars(name) || add1.length==0 || zip.length!=6 || !$.isNumeric(zip) || city.length==0 || state.length==0 || country.length==0){
        if(name.length==0 || !checkspecialchars(name)){
          var htmlerr='Please enter name without special characters';
        }else if(add1.length==0){
          var htmlerr='Please enter address';
        }else if(zip.length!=6 || !$.isNumeric(zip)){
          var htmlerr='Please enter valid pincode';
        }else if(city.length==0){
          var htmlerr='Please enter city';
        }else if(state.length==0){
          var htmlerr='Please enter state';
        }else if(country.length==0){
          var htmlerr='Please enter country';
        }
        $('#snackbars').modal('show');
        $("#snackbars").html(htmlerr);
             setTimeout(function(){ 
              $('#snackbars').modal('hide');}, 3000);
       }else{ var add3=add2.length==0?'NA':add2;
       var dob=dob.length==0?'NA':dob;
        $.ajax({
          url:baseurl+"user/update_user",
          method:"POST",
          data:{name:name,add1:add1,add2:add3,zip:zip,city:city,state:state,country:country,dob:dob},
          dataType:'json',
          cache:false,
          beforeSend:function(){
            $(document.body).css({'cursor' : 'wait'});
            $("#profile_update").html('Please wait....');
          },
          success:function(data){
             if(data.ok==1){
              $("#address").load(location.href + " #address");
               $('#snackbars').modal('show');
               $("#snackbars").html(data.msg);
               setTimeout(function(){ 
                $('#snackbars').modal('hide');}, 3000);
              $(document.body).css({'cursor' : 'default'});
              $("#profile_update").html('Update Profile');
              }else{
                alert(data.err);
                $(document.body).css({'cursor' : 'default'});
                $("#profile_update").html('Update Profile');
              }
          } /*,error:function(e,a,r){alert(e.status),alert(a),alert(r)}*/
        });
       }
 });
 function open_model(id) {  
  $("#exampleModal").modal("toggle");
  $("#cancel_id").val(id);  
}
function open_return_model() {  
  $("#exampleModalReturn").modal("toggle");
}
$("#save_cancel").click(function(){
  var cid=$("#cancel_id").val(),
  cr=$("#cancel_reason").val();
  if(cid.length!=0 && $.isNumeric(cid) && cr.length!=0){
    $.ajax({
      url:baseurl+"order/cancel_order",
      method:"POST",
      data:{cid:cid,cr:cr},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){
           //$(".checkorderstatus").load(location.href + " .checkorderstatus");
           $('#snackbars').modal('show');
           $("#snackbars").html(data.msg);
           $("#cancel_reason").val('');
           setTimeout(function(){ 
            $('#snackbars').modal('hide');
            $("#exampleModal").modal("hide");location.reload();}, 3000);
          $(document.body).css({'cursor' : 'default'});
          }else{
            alert(data.err);
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }else{
    if(cr.length==0){
      $('#snackbars').modal('show');
           $("#snackbars").html('PLEASE ENTER CANCEL REASON');
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
    }
  }
});
$("#apply_coupon").click(function(){
  var cc=$.trim($("#cc").val());
  var radioValue = $("input[name='method']:checked").val();
  if(cc.length==0){
    $("#cc_error").html('Please enter coupon code');
  }else{
    $.ajax({
      url:baseurl+"checkout/apply_coupon",
      method:"POST",
      data:{cc:cc,radioValue:radioValue},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});
        $("#cc_error").html('');
        $('#myModal1').modal('show');
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 3000);
      },
      success:function(data){
         if(data.ok==1){
           //$(".order-table").load(location.href + " .order-table"); 
           $("#cc_error").css('color','green');
           $("#cc_error").html(data.msg);           
          $(document.body).css({'cursor' : 'default'});
          $(".discount").show();
          $("#dis_amt").html('- ₹ '+data.dis_amt);
          $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
          //$(".final-price").html(data.dis_amt);
          if(data.cash_back==1){
            //earned_points
            $(".earned-points").show();
            $("#earned_points").html('₹ '+data.cash_back_point);
            $('#snackbars').modal('show');
          $("#snackbars").html(data.congmsg);
          setTimeout(function(){ 
           $('#snackbars').modal('hide');}, 3000);
          }else{
            $(".earned-points").hide();
            $("#earned_points").html('₹ 0');
          }
          }else{
            $("#cc_error").html(data.err);
            $("#cc_error").css('color','red');
            $(".discount").hide();
            $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
});
function check_method(){
  var radioValue = $("input[name='method']:checked").val();
  if(radioValue=='COD'){
    $.ajax({
      url:baseurl+"checkout/shipping_discount",
      method:"POST",
      data:{option_val:radioValue},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});
      },
      success:function(data){
         if(data.ok==1){      
           $('#myModal1').modal('show');
           setTimeout(function(){ 
            $('#myModal1').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          //$(".shipping-discount").hide();
          $(".shipping-discount").html('<b>Shipping Discount <i class="fa fa-tag"></i> 50%</b><span id="dis_ship_amt"> ₹ </span>');
            $("#dis_ship_amt").html('- ₹ '+data.dis_ship_amt);
          //$("#dis_ship_amt").html('');
          $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
          }else{
            $(".shipping-discount").hide();
            $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }else if(radioValue=='RazorPay'){
    $.ajax({
      url:baseurl+"checkout/shipping_discount",
      method:"POST",
      data:{option_val:radioValue},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});
      },
      success:function(data){
         if(data.ok==1){
           $('#myModal1').modal('show');
           setTimeout(function(){ 
            $('#myModal1').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          $(".shipping-discount").show();
          if(data.msg==1){ 
            $(".shipping-discount").html('<b>Free Shipping <i class="fa fa-tag"></i> </b><span id="dis_ship_amt"> ₹ </span>');
            $("#dis_ship_amt").html('- ₹ '+data.dis_ship_amt);
          }else if(data.msg==2){
            $(".shipping-discount").html('<b>Shipping Discount <i class="fa fa-tag"></i> 70%</b><span id="dis_ship_amt"> ₹ </span>');
            $("#dis_ship_amt").html('- ₹ '+data.dis_ship_amt);
          }          
          $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');            
          }else{
            $(".shipping-discount").hide();
            $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }else if(radioValue=='PartPay'){
    $.ajax({
      url:baseurl+"checkout/shipping_discount",
      method:"POST",
      data:{option_val:radioValue},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});
      },
      success:function(data){
         if(data.ok==1){      
           $('#myModal1').modal('show');
           setTimeout(function(){ 
            $('#myModal1').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          $(".shipping-discount").show();
          $("#dis_ship_amt").html('₹ '+data.dis_ship_amt);
          $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');            
          }else{
            $(".shipping-discount").hide();
            $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }else if(radioValue=='DIRECTCOD'){
    $.ajax({
      url:baseurl+"checkout/shipping_discount",
      method:"POST",
      data:{option_val:radioValue},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});
      },
      success:function(data){
         if(data.ok==1){      
           $('#myModal1').modal('show');
           setTimeout(function(){ 
            $('#myModal1').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          $(".shipping-discount").show();
          $(".shipping-discount").html('<b>Shipping Discount <i class="fa fa-tag"></i> 50%</b><span id="dis_ship_amt"> ₹ </span>');
          $("#dis_ship_amt").html('- ₹ '+data.dis_ship_amt);
          $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');            
          }else{
            $(".shipping-discount").hide();
            $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
}
$("#place_order").click(function(){
  var name=$.trim($("#name").val()),
      email=$.trim($("#email").val()),
      phone=$.trim($("#phone").val()),
      address1=$.trim($("#address1").val()),
      address2=$.trim($("#address2").val()),
      city=$.trim($("#city").val()),
      state=$.trim($("#state").val()),
      zip=$.trim($("#zip").val()),
      country=$.trim($("#country").val()),
      gstin=$.trim($("#gstin").val()),
      radioValue = $("input[name='method']:checked").val();
      if(name.length==0 || !checkspecialchars(name) || !validateEmail(email) || !validatePhone(phone) || address1.length==0 || city.length==0 || state.length==0 || zip.length!=6 || country.length==0){
        if(name.length==0 || !checkspecialchars(name)){
          var errmsg='PLEASE ENTER NAME WITHOUT SPECIAL CHARACTERS';
        }else if(!validateEmail(email)){
          var errmsg='PLEASE ENTER EMAIL IN VALID FORMAT';
        }else if(!validatePhone(phone)){
          var errmsg='PLEASE ENTER PHONE NUMBER IN VALID FORMAT';
        }else if(address1.length==0){
          var errmsg='PLEASE ENTER ADDRESS';
        }else if(city.length==0){
          var errmsg='PLEASE ENTER CITY';
        }else if(state.length==0){
          var errmsg='PLEASE ENTER STATE';
        }else if(zip.length!=6){
          var errmsg='PLEASE ENTER PINCODE';
        }else if(country.length==0){
          var errmsg='PLEASE ENTER COUNTRY';
        }
        $('#snackbars').modal('show');
           $("#snackbars").html(errmsg);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
      }else{
        if(radioValue=='COD'){
          var add2=address2.length!=0?address2:'NA';
          var gst=gstin.length!=0?gstin:'NA';
          $.ajax({
            url:baseurl+"order/place_cod_order",
            method:"POST",
            data:{name:name,email:email,phone:phone,address1:address1,address2:add2,city:city,state:state,zip:zip,country:country,option_val:radioValue,gstin:gst},
            dataType:'json',
            cache:false,
            beforeSend:function(){
              $(document.body).css({'cursor' : 'wait'});
            },
            success:function(data){
               if(data.ok==1){    
                $(document.body).css({'cursor' : 'default'});
                window.location.href=baseurl+'preview-cod-order';
                }else{
                  alert(data.err);  
                  $(document.body).css({'cursor' : 'default'});
                }
            } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
          });
        }else if(radioValue=='RazorPay'){
          var add2=address2.length!=0?address2:'NA';
          var gst=gstin.length!=0?gstin:'NA';
          $.ajax({
            url:baseurl+"order/place_online_order",
            method:"POST",
            data:{name:name,email:email,phone:phone,address1:address1,address2:add2,city:city,state:state,zip:zip,country:country,option_val:radioValue,gstin:gst},
            dataType:'json',
            cache:false,
            beforeSend:function(){
              $(document.body).css({'cursor' : 'wait'});
            },
            success:function(data){
               if(data.ok==1){    
                $(document.body).css({'cursor' : 'default'});
                window.location.href=baseurl+'preview-order';
                }else{
                  alert(data.err);  
                  $(document.body).css({'cursor' : 'default'});
                }
            } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
          });
        }else if(radioValue=='PartPay'){
          var add2=address2.length!=0?address2:'NA';
          var gst=gstin.length!=0?gstin:'NA';
          $.ajax({
            url:baseurl+"order/place_partpay_order",
            method:"POST",
            data:{name:name,email:email,phone:phone,address1:address1,address2:add2,city:city,state:state,zip:zip,country:country,option_val:radioValue,gstin:gst},
            dataType:'json',
            cache:false,
            beforeSend:function(){
              $(document.body).css({'cursor' : 'wait'});
            },
            success:function(data){
               if(data.ok==1){    
                $(document.body).css({'cursor' : 'default'});
                window.location.href=baseurl+'preview-part-pay-order';
                }else{
                  alert(data.err);  
                  $(document.body).css({'cursor' : 'default'});
                }
            } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
          });
        }
        else if(radioValue=='DIRECTCOD'){
          var add2=address2.length!=0?address2:'NA';
          var gst=gstin.length!=0?gstin:'NA';
          $.ajax({
            url:baseurl+"order/place_direct_cod_order",
            method:"POST",
            data:{name:name,email:email,phone:phone,address1:address1,address2:add2,city:city,state:state,zip:zip,country:country,option_val:radioValue,gstin:gst},
            dataType:'json',
            cache:false,
            beforeSend:function(){
              $(document.body).css({'cursor' : 'wait'});
            },
            success:function(data){
               if(data.ok==1){    
                $(document.body).css({'cursor' : 'default'});
                alert(data.msg);
                window.location.href=baseurl+'my-account';
                }else{
                  alert(data.err);  
                  $(document.body).css({'cursor' : 'default'});
                }
            } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
          });
        }
      }
});
$("#newsletter").click(function(){
  var email=$.trim($("#news_mail").val());
  if(email.length==0 || !validateEmail(email)){
    $('#snackbars').modal('show');
    $("#snackbars").html('INVALID EMAIL ID');
    setTimeout(function(){ 
     $('#snackbars').modal('hide');}, 3000);
  }else{
    $.ajax({
      url:baseurl+"user/add_newsletter",
      method:"POST",
      data:{email:email},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){         
           $('#snackbars').modal('show');
           $("#snackbars").html(data.msg);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
            $("#news_mail").val('');
          $(document.body).css({'cursor' : 'default'});
          }else{
            alert(data.err);
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
  
});
$("#sendcontact").click(function () {
  var e = $.trim($("#con_name").val()),
      a = $.trim($("#con_email").val()),
      t = $.trim($("#con_phone").val()),
      r = $.trim($("#con_msg").val());
  0 != e.length  && 0 != a.length && validateEmail(a) && 0 != r.length && 10 == t.length && validatePhone(t)
      ? $.ajax({
            url: baseurl + "contact/formsubmit",
            method: "POST",
            data: { con_name: e, con_email: a, con_msg: r, con_phone: t },
            dataType: "json",
            cache: !1,
            beforeSend: function () {
                $("#sendcontact").html("Please wait...."), $("#contact_error").html("");
            },
            success: function (e) {
                1 == e.ok
                    ? ($('#snackbars').modal('show'),
                    $("#snackbars").html(e.msg),
                    setTimeout(function(){ 
                     $('#snackbars').modal('hide');}, 3000), $("#sendcontact").html("SEND MESSAGE"), $("#con_phone").val(""), $("#con_name").val(""), $("#con_email").val(""), $("#con_msg").val(""))
                    : ($("#contact_error").removeClass("d-none"), $("#contact_error").html(e.errmsg),alert(e.errmsg), $("#sendcontact").html("SEND MESSAGE"));
            },
            error: function (e, a, t) {
                alert(e.status), alert(a), alert(t);
            },
        })
      : 0 == e.length
      ? $("#contact_error").html("Please enter name")
      : 0 != a.length && validateEmail(a)
      ? 10 == t.length && validatePhone(t)
          ? 0 == r.length && $("#contact_error").html("Please enter message")
          : $("#contact_error").html("Please enter valid 10 diigit mobile number")
      : $("#contact_error").html("Please enter valid email address");
});
function add_to_cart_more(qty){
  //var proqty=$("#pro_qty").val(),
   pin=$("#pincode").val(),
   pid=$("#pid").val();
   if(qty<1){
    $("#error").html('Please select atleat 1 quantity');
   }else if(pin.length!=6){
    $("#error").html('Please enter 6 digit pincode');
   }else{
    $("#error").html('');
    $.ajax({
      url:baseurl+"cart/add_to_cart",
      method:"POST",
      data:{proqty:qty,pid:pid},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){
           //$("#avail_details").html(data.msg);
           $(".nav-right").load(location.href + " .nav-right");
           $("#addcrt").html('ADDED TO CART');
           $('#snackbars').modal('show');
           $("#snackbars").html(data.msg);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          }else{
            alert(data.err);
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
   }
}
function wallet_check(){
  var wallet_check = $("input[name='wallet_check']:checked").val(),
  radioValue = $("input[name='method']:checked").val();
if(wallet_check==1){
var wallet_checked=1;
}else{
  var wallet_checked=2;
}
    $.ajax({
      url:baseurl+"wallet/wallet_discount",
      method:"POST",
      data:{wallet_check:wallet_checked,radioValue:radioValue},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $(document.body).css({'cursor' : 'wait'});
        $('#myModal1').modal('show');
           setTimeout(function(){ 
            $('#myModal1').modal('hide');}, 3000);
      },
      success:function(data){
         if(data.ok==1){
           if(data.msg){
          $('#snackbars').modal('show');
          $("#snackbars").html(data.msg);
          setTimeout(function(){ 
           $('#snackbars').modal('hide');}, 3000);
          }
         $(document.body).css({'cursor' : 'default'});
          //$(".shipping-discount").show();
          if(data.msg==1){
            //$(".shipping-discount").html('<b>Free Shipping <i class="fa fa-tag"></i> </b><span id="dis_ship_amt"> ₹ </span>');
            //$("#dis_ship_amt").html('₹ '+data.dis_ship_amt);
          }else if(data.msg==2){
            //$(".shipping-discount").html('<b>Shipping Discount <i class="fa fa-tag"></i> 25%</b><span id="dis_ship_amt"> ₹ </span>');
            //$("#dis_ship_amt").html('₹ '+data.dis_ship_amt);
          }          
          $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');            
          }else{
            //$(".shipping-discount").hide();
            $(".final-price").html('Total <span>₹ '+data.discounted_total+' </span>');
            $(document.body).css({'cursor' : 'default'});
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  
}
$("#post_comment").click(function(){
  var id=$.trim($("#blgid").val()),
  name=$.trim($("#name").val()),
  message=$.trim($("#message").val());
  if(name.length==0 || !checkspecialchars(name) || message.length<21 || !$.isNumeric(id)){
    if(name.length==0 || !checkspecialchars(name)){
      var errmsg='Please enter name without special characters';
    }else if(message.length<21){
      var errmsg='Please enter comment with atleat 20 characters';
    }else if(!$.isNumeric(id)){
      var errmsg='Unexpected Error';
    }
    $('#snackbars').modal('show');
         $("#snackbars").html(errmsg);
         setTimeout(function(){ 
          $('#snackbars').modal('hide');}, 3000);
  }else{
    $.ajax({
      url:baseurl+"blog/add_comment",
      method:"POST",
      data:{id:id,name:name,message:message},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $("#post_comment").html('Please Wait...');
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){
           $('#snackbars').modal('show');
           $("#snackbars").html(data.msg);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          $("#post_comment").html('Post Comment');
          $("#name").val('');
          $("#message").val('');
          }else{
            alert(data.err);
            $(document.body).css({'cursor' : 'default'});
            $("#post_comment").html('Post Comment');
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
});
$("#password_reset_req").click(function(){
  var email=$.trim($("#email").val());
  if(email.length==0 || !validateEmail(email)){
    $('#snackbars').modal('show');
           $("#snackbars").html('Please Enter Email in Valid Format');
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
  }else{
    $.ajax({
      url:baseurl+"user/forgot_pass",
      method:"POST",
      data:{email:email},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $("#password_reset_req").html('Please Wait...');
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){
           $('#snackbars').modal('show');
           $("#snackbars").html(data.msg);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          $("#password_reset_req").html('Continue');
          $("#name").val('');
          $("#message").val('');
          }else{
            $('#snackbars').modal('show');
           $("#snackbars").html(data.err);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
            $(document.body).css({'cursor' : 'default'});
            $("#password_reset_req").html('Continue');
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
});
$("#change_pass").click(function(){
  var newpass=$.trim($("#newpass").val()),
  cpass=$.trim($("#cpass").val()),
  access_token=$.trim($("#access_token").val()),
  email=$.trim($("#email").val());
  if(newpass.length==0 || cpass.length==0 || cpass!=newpass || !validateEmail(email)){
    if(newpass.length==0){
      var errmsg='Please enter new password';
    }else if(cpass.length==0){
      var errmsg='Please enter confirm password';
    }else if(cpass!=newpass){
      var errmsg='New Password and Confirm Password does not match';
    }else if(!validateEmail(email)){
      var errmsg='Unexpected Error Occured';
    }
    $('#snackbars').modal('show');
           $("#snackbars").html(errmsg);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
  }else{
    $.ajax({
      url:baseurl+"user/change_pass",
      method:"POST",
      data:{newpass:newpass,cpass:cpass,access_token:access_token,email:email},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $("#change_pass").html('Please Wait...');
        $(document.body).css({'cursor' : 'wait'});               
      },
      success:function(data){
         if(data.ok==1){
           $('#snackbars').modal('show');
           $("#snackbars").html(data.msg);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
          $(document.body).css({'cursor' : 'default'});
          $("#change_pass").html('Continue');
          $("#newpass").val('');
          $("#cpass").val('');
          }else{
            $('#snackbars').modal('show');
           $("#snackbars").html(data.err);
           setTimeout(function(){ 
            $('#snackbars').modal('hide');}, 3000);
            $(document.body).css({'cursor' : 'default'});
            $("#change_pass").html('Continue');
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
});
function sortItems(id){
  var sort=$(".sorting").val();
  $.ajax({
    url:baseurl+"product/sortbypricecat",
    method:"POST",
    data:{id:id,sort:sort},
    dataType:'json',
    cache:false,
    beforeSend:function(){
      $('#myModal1').modal('show');
    },
    success:function(data){
       if(data.ok==1){
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 3000);
           $("#products").html(data.htmlmsg);
        }else{
          alert(data.err);
        }
    } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
  });
}
function sortItemsBySubCat(id){
  var sort=$(".sorting").val();
  $.ajax({
    url:baseurl+"product/sortbypricesubcat",
    method:"POST",
    data:{id:id,sort:sort},
    dataType:'json',
    cache:false,
    beforeSend:function(){
      $('#myModal1').modal('show');
    },
    success:function(data){
       if(data.ok==1){
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 3000);
           $("#products").html(data.htmlmsg);
        }else{
          alert(data.err);
        }
    } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
  });
}
function accessories_price_filter(id){
  var minval=$("#minamount").val().replace('₹', '');
  var maxval=$("#maxamount").val().replace('₹', '');
  //alert(minval+" "+maxval);
  $.ajax({
    url:baseurl+"product/accessories_price_filter",
    method:"POST",
    data:{id:id,minval:minval,maxval:maxval},
    dataType:'json',
    cache:false,
    beforeSend:function(){
      $('#myModal1').modal('show');
    },
    success:function(data){
       if(data.ok==1){
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 2000);
           $("#products").html(data.htmlmsg);
        }else{
          alert(data.err);
        }
    } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
  });
}
function accessories_price_subcat_filter(id){
  var minval=$("#minamount").val().replace('₹', '');
  var maxval=$("#maxamount").val().replace('₹', '');
  //alert(minval+" "+maxval);
  $.ajax({
    url:baseurl+"product/accessories_price_subcat_filter",
    method:"POST",
    data:{id:id,minval:minval,maxval:maxval},
    dataType:'json',
    cache:false,
    beforeSend:function(){
      $('#myModal1').modal('show');
    },
    success:function(data){
       if(data.ok==1){
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 2000);
           $("#products").html(data.htmlmsg);
        }else{
          alert(data.err);
        }
    } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
  });
}
function filter_items(type,filter_name,filter_value,chkbx){
  var id=$.trim($("#subcat").val());
  var minval=$("#minamount").val().replace('₹', '');
  var maxval=$("#maxamount").val().replace('₹', '');
  var array = [];
  $('input[name="filter_items"]:checked').each(function() {
      array.push($(this).val());
      array1=array.join('_');
   });
   var checkbox=array.length==0?'NA':array1;
   $.ajax({
    url:baseurl+"product/accessories_price_subcat_filter_type",
    method:"POST",
    data:{id:id,minval:minval,maxval:maxval,filter_name:filter_name,checkbox:checkbox},
    dataType:'json',
    cache:false,
    beforeSend:function(){
      $('#myModal1').modal('show');
    },
    success:function(data){
       if(data.ok==1){
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 2000);
           $("#products").html(data.htmlmsg);
        }else{
          alert(data.err);
        }
    } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
  });
}
function accessories_price_subcat_filter_type(id){
  var id=$.trim($("#subcat").val());
  var minval=$("#minamount").val().replace('₹', '');
  var maxval=$("#maxamount").val().replace('₹', '');
  var array = [];
  $('input[name="filter_items"]:checked').each(function() {
      array.push($(this).val());
      array1=array.join('_');
   });
   var checkbox=array.length==0?'NA':array1;
   var filter_name='flow_per_hour';
  $.ajax({
    url:baseurl+"product/accessories_price_subcat_filter_type",
    method:"POST",
    data:{id:id,minval:minval,maxval:maxval,filter_name:filter_name,checkbox:checkbox},
    dataType:'json',
    cache:false,
    beforeSend:function(){
      $('#myModal1').modal('show');
    },
    success:function(data){
       if(data.ok==1){
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 2000);
           $("#products").html(data.htmlmsg);
        }else{
          alert(data.err);
        }
    } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
  });
}
$("#req-call-back").click(function(){
  var phone=$.trim($("#recipient-name").val());
  if(phone.length==0 || !validatePhone(phone)){
    if(phone.length==0 || !validatePhone(phone)){
      var htmlerr='Please enter 10 digit mobile number without 0 or +91';
    }
    $("#callbackreqerror").css('color','red');
    $("#callbackreqerror").html(htmlerr);
  }else{
    $.ajax({
      url:baseurl+"contact/callbackformsubmit",
      method:"POST",
      data:{phone:phone},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        $("#req-call-back").html('wait...');
        $("#callbackreqerror").html("");                
      },
      success:function(data){
         if(data.ok==1){
          $("#req-call-back").html("Request Call Back");
          $("#callbackreqerror").css('color','green');
          $("#callbackreqerror").html(data.msg);
          $("#recipient-name").val('');
          setTimeout(function(){ 
            $('#exampleModalCenter').modal('hide');
            $("#callbackreqerror").html("");}, 3000);
          }else{
            $("#callbackreqerror").css('color','red');
            $("#callbackreqerror").html(data.err);
            $("#req-call-back").html("Request Call Back");
          }
      } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
    });
  }
});
/*$("#tags").keyup(function(){
  var tags=$.trim($("#tags").val());
  if(tags.length>3){
    $.ajax({
      url:baseurl+"product/header_search",
      method:"POST",
      data:{tags:tags},
      dataType:'json',
      cache:false,
      beforeSend:function(){
        //$('#myModal1').modal('show');
      },
      success:function(data){
         if(data.ok==1){
     
          var num=data.num;
          var availableTags=[];
          for(var i=1; i<=30;i++){        
            availableTags.push(data.htmlmsg[i]['pname']);
          }     
      }else{
         alert(data.err);
          }        
          $( "#tags" ).autocomplete({
        source: availableTags
      });
      } 
    });
  }
});*/
function frp_filter_items(){
  var id=$.trim($("#subcat").val());
  var minval=$("#minamount").val().replace('₹', '');
  var maxval=$("#maxamount").val().replace('₹', '');
  var array = [];
  $('input[name="filter_items"]:checked').each(function() {
      array.push($(this).val());
      array1=array.join('_');
   });
   var checkbox=array.length==0?'NA':array1;
   //alert('id-'+id+',minval-'+minval+',maxval-'+maxval+',checkbox-'+checkbox);
   $.ajax({
    url:baseurl+"product/accessories_price_subcat_filter_type_frp_vessel",
    method:"POST",
    data:{id:id,minval:minval,maxval:maxval,checkbox:checkbox},
    dataType:'json',
    cache:false,
    beforeSend:function(){
      $('#myModal1').modal('show');
    },
    success:function(data){
       if(data.ok==1){
        setTimeout(function(){ 
          $('#myModal1').modal('hide');}, 2000);
           $("#products").html(data.htmlmsg);
        }else{
          alert(data.err);
        }
    } ,error:function(e,a,r){alert(e.status),alert(a),alert(r)}
  });
}