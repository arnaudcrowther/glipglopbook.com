$(function() {

  
  //get query from url and load books
  var url = $(location).attr('href');
  url = getPathFromUrl(url);
  if (url) {
    loadBooks(url);
    if(url!="all") {
      $('.sheet h1').text(url);
    }
  } else {
    loadBooks('all');
  }
  
  
  $('#btn-modal-book-buy-login').click(function() {
    $('#modal-book').closeModal();
    $('#modal-warning-login').openModal();
  });
  $('#btn-modal-book-buy').click(function() {
    var id = this.getAttribute('book-id');
    openBuyModal(id);
    $('#modal-book').closeModal();
    $('#modal-buy').openModal();
  });
  
  
  $("#btn-login").click(function(){
    var mydata = $("form.drop-down-login").serialize();
    $.ajax({
        type: "POST",
        url: "../php/login.php",
        data: mydata,
        success: function(response, textStatus, xhr) {
          console.log(response);
          if (response=="true") {
            $('.invalid').slideUp();
            location.href=".";
          }
          else {
            $('.invalid').slideDown('fast');
            $(".drop-down-login input").val('');
          }
        },
        error: function(xhr, textStatus, errorThrown) {}
    });
    return false;
  });
  
  
  $('#btn-modal-buy-send').click(function(){
    console.log(this);
  });
  
  
});



function loadBooks(cat) {
  $.ajax({
    type: 'POST',
    url: '../php/load-category.php',
    dataType: 'json',
    data: {cat:cat},
    cache: false,
    success: function(result) {
      console.log(result);
      $('.book-cont').empty();
      $('.book').tooltip('remove');
      for (i = 0; i < result.length; i++) {
        var title = result[i].title;
        title = title.replace("'", "");
        title = title.trunc(60);
        $('.book-cont').append(
          $("<div id='"+result[i].bookid+"' class='book-wrapper'>")
          .append(
            $("<div book-id='"+result[i].bookid+"' class='book tooltipped z-depth-1' onclick='openBookModal("+result[i].bookid+")' style='background-image: url("+result[i].img+")' data-tooltip='"+title+"' data-position='top'>")
          ));
        $('.book').tooltip({delay: 0});
      }
    }
  });
}






// book click opens modal and gets book info from DB
function openBookModal(bookid) {
  $.ajax( {
      type: "POST",
      url: "../php/get-book.php",
      data: {bookid:bookid},
      cache: false,
      dataType: 'json',
      success: function(result){
        console.log(result);
        $('#modal-book .modal-header').html(result.title);
        $('#inpt-modal-book-title').val(result.title);
        $('#inpt-modal-book-author').val(result.author);
        $('#inpt-modal-book-category').val(result.category);
        $('select').material_select();
        $('#inpt-modal-book-pub').val(result.publisher);
        $('#inpt-modal-book-price').val(result.price);
        $('#inpt-modal-book-isbn').val(result.isbn);
        $("#modal-book .preview").css('background-image','url('+result.img+')');
      }
    });
  $('#modal-book').openModal();
  $('#btn-modal-book-buy').attr('book-id',bookid);
}



// open the book request modal and fill
function openBuyModal(bookid) {
  $('#txt-modal-buy-message').val('');
  $("label[for='txt-modal-buy-message']").removeClass('active');
  console.log(bookid);
  $.ajax( {
    type: "POST",
    url: "../php/get-book.php",
    data: {bookid:bookid},
    cache: false,
    dataType: 'json',
    success: function(result){
      console.log(result);
      $('#modal-buy .title').text(result.title);
      $('#modal-buy .author').text(result.author);
      $('#modal-buy .isbn').text(result.isbn);
      $('#modal-buy-price').text(result.price);
      $('#inpt-hide-book').val(bookid);
      $('#inpt-hide-owner').val(result.owner);
      console.log(result.owner);
      $.ajax( {
        type: "POST",
        url: "../php/get-owner.php",
        data: {id:result.owner},
        cache: false,
        dataType: 'json',
        success: function(result){
          console.log(result);
          $('#modal-buy-user').text(result.first+" "+result.last);
          $('#modal-buy-campus').text(result.campus);
        }
      });
    }
  });
}



// get url path for search query from any page
function getPathFromUrl(url) {
  return url.split("=")[1];
}



