(function ($) {
  'use strict';

  /*------------------------------------------
        = FUNCTIONS
    -------------------------------------------*/

  $('div.toggle-filter').addClass('mb-4');
  $('.button-toggle-filter').on('click', function () {
    $('#filter-1').toggle('slow', function () {
      $('div.toggle-filter').toggleClass('mb-4');
      if ($('#filter-1').is(':visible')) {
        $('.text-toggle-filter').html('Hide Filter'); // Update text
      } else {
        $('.text-toggle-filter').html('Show Filter');
      }
    });
    $('#filter-2').toggle('slow');
  });

  // Toggle mobile navigation
  function toggleMobileNavigation() {
    var navbar = $('.navigation-holder');
    var openBtn = $('.open-btn');
    var closeBtn = $('.navigation-holder .close-navbar');

    openBtn.on('click', function () {
      if (!navbar.hasClass('slideInn')) {
        navbar.addClass('slideInn');
      }
      return false;
    });

    closeBtn.on('click', function () {
      if (navbar.hasClass('slideInn')) {
        navbar.removeClass('slideInn');
      }
      return false;
    });
  }

  toggleMobileNavigation();

  // Function for toggle a class for small menu
  function toggleClassForSmallNav() {
    var windowWidth = window.innerWidth;
    var mainNav = $('#navbar > ul');

    if (windowWidth <= 991) {
      mainNav.addClass('small-nav');
    } else {
      mainNav.removeClass('small-nav');
    }
  }

  toggleClassForSmallNav();

  // Function for small menu
  function smallNavFunctionality() {
    var windowWidth = window.innerWidth;
    var mainNav = $('.navigation-holder');
    var smallNav = $('.navigation-holder > .small-nav');
    var subMenu = smallNav.find('.sub-menu');
    var megamenu = smallNav.find('.mega-menu');
    var menuItemWidthSubMenu = smallNav.find('.menu-item-has-children > a');

    if (windowWidth <= 991) {
      subMenu.hide();
      megamenu.hide();
      menuItemWidthSubMenu.on('click', function (e) {
        var $this = $(this);
        $this.siblings().slideToggle();
        e.preventDefault();
        e.stopImmediatePropagation();
      });
    } else if (windowWidth > 991) {
      mainNav.find('.sub-menu').show();
      mainNav.find('.mega-menu').show();
    }
  }

  // function to toggle password input type
  $('#togglePassword').on('click', function () {
    var passwordField = $('#inputPassword4');
    var passwordFieldType = passwordField.attr('type');
    var newType = passwordFieldType === 'password' ? 'text' : 'password';
    passwordField.attr('type', newType);

    $(this).find('i').toggleClass('fa-eye fa-eye-slash');
  });

  smallNavFunctionality();

  let _qrCodeModal = null;

  const qrURL = $('#qr-url').val();
  const qrContainer = document.getElementById('qr-container');
  if (qrContainer) {
    new QRCode(qrContainer, {
      text: qrURL,
      width: 40,
      height: 40,
    });
  }

  $('#qrcodeModal').on('shown.bs.modal', function () {
    const qrModal = document.getElementById('qrcode-modal');
    if (qrModal && !_qrCodeModal) {
      _qrCodeModal = new QRCode(qrModal, {
        text: qrURL,
      });
    }
  });

  $('#layout').change(function () {
    let layout = $(this).val();
    if (layout == 'grid') {
      $('.image').show();
    } else {
      $('.image').hide();
    }
  });

  /*------------------------------------------
        = STICKY HEADER
    -------------------------------------------*/

  // Function for clone an element for sticky menu
  function cloneNavForSticyMenu($ele, $newElmClass) {
    $ele
      .addClass('original')
      .clone()
      .insertAfter($ele)
      .addClass($newElmClass)
      .removeClass('original');
  }

  // clone home style 1 navigation for sticky menu
  if ($('.site-header .navigation').length) {
    cloneNavForSticyMenu($('.site-header .navigation'), 'sticky-header');
  }

  var lastScrollTop = '';

  function stickyMenu($targetMenu, $toggleClass) {
    var st = $(window).scrollTop();
    var mainMenuTop = $('.site-header .navigation');

    if ($(window).scrollTop() > 1000) {
      if (st > lastScrollTop) {
        // hide sticky menu on scroll down
        $targetMenu.removeClass($toggleClass);
      } else {
        // active sticky menu on scroll up
        $targetMenu.addClass($toggleClass);
      }
    } else {
      $targetMenu.removeClass($toggleClass);
    }

    lastScrollTop = st;
  }

  $('body').on('click', function () {
    $('.navigation-holder').removeClass('slideInn');
  });
  $('.menu-close').on('click', function () {
    $('.navigation-holder').removeClass('slideInn');
  });
  $('.menu-close').on('click', function () {
    $('.open-btn').removeClass('x-close');
  });

  // toggle1
  $('#toggle1').on('click', function () {
    $('.create-account').slideToggle();
    $('.caupon-wrap.s1').toggleClass('active-border');
  });

  // toggle2
  $('#toggle2').on('click', function () {
    $('#open2').slideToggle();
    $('.caupon-wrap.s2').toggleClass('coupon-2');
  });

  // toggle3
  $('#toggle3').on('click', function () {
    $('#open3').slideToggle();
    $('.caupon-wrap.s2').toggleClass('coupon-2');
  });
  // toggle4
  $('#toggle4').on('click', function () {
    $('#open4').slideToggle();
    $('.caupon-wrap.s3').toggleClass('coupon-2');
  });

  $('.payment-select .addToggle').on('click', function () {
    $('.payment-name').addClass('active');
    $('.payment-option').removeClass('active');
  });

  $('.payment-select .removeToggle').on('click', function () {
    $('.payment-option').addClass('active');
    $('.payment-name').removeClass('active');
  });

  // tooltips

  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /*------------------------------------------
        = TEAM SECTION
    -------------------------------------------*/
  var singleMember = $('.social');
  singleMember.on('click', function () {
    $(this).toggleClass('active');
  });

  /*------------------------------------------
      static-hero-slide-img SLIDER
      -------------------------------------------*/
  if ($('.static-hero-slide-img').length) {
    $('.static-hero-slide-img').owlCarousel({
      autoplay: true,
      smartSpeed: 300,
      margin: 10,
      loop: true,
      autoplayHoverPause: true,
      dots: true,
      arrows: false,
      nav: true,
      navText: ['<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>'],
      responsive: {
        0: {
          items: 1,
          dots: true,
          arrows: false,
          nav: false,
        },

        575: {
          items: 1,
        },
        767: {
          items: 1,
          dots: false,
        },

        992: {
          items: 2,
          dots: false,
        },

        1200: {
          items: 3,
        },
      },
    });
  }

  /*------------------------------------------
            service slider
       -------------------------------------------*/
  if ($('.service-slider').length) {
    $('.service-slider').owlCarousel({
      autoplay: false,
      smartSpeed: 300,
      margin: 20,
      loop: true,
      autoplayHoverPause: true,
      dots: false,
      nav: true,
      navText: [
        '<i class="fi flaticon-left-arrow"></i>',
        '<i class="fi flaticon-right-arrow"></i>',
      ],
      responsive: {
        0: {
          items: 1,
          dots: true,
          nav: false,
        },

        500: {
          items: 1,
          dots: true,
          nav: false,
        },

        768: {
          items: 2,
          nav: false,
        },
        991: {
          items: 2,
        },
        1200: {
          items: 3,
        },

        1400: {
          items: 3,
        },
      },
    });
  }

  /*------------------------------------------
        = PARTNERS SLIDER
    -------------------------------------------*/
  if ($('.partners-slider').length) {
    $('.partners-slider').owlCarousel({
      autoplay: true,
      smartSpeed: 300,
      margin: 30,
      loop: true,
      autoplayHoverPause: true,
      dots: false,
      responsive: {
        0: {
          items: 2,
        },

        550: {
          items: 3,
        },

        992: {
          items: 4,
        },

        1200: {
          items: 6,
        },
      },
    });
  }

  // testimonial-slider
  $(function () {
    $('.testimonial-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-navbar',
    });
    $('.slider-navbar').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: '.testimonial-slider',
      arrows: true,
      dots: false,
      centerMode: true,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: true,
          },
        },
      ],
    });
  });

  $('.slider-hero').slick({
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    dots: false,
    // asNavFor: '.slider-nav',
  });

  /*------------------------------------------
         = SHOP DETAILS PAGE PRODUCT SLIDER
     -------------------------------------------*/
  $(function () {
    if ($('.shop-single-slider').length) {
      $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.slider-nav',
      });
      $('.slider-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        focusOnSelect: true,
        prevArrow: '<i class="nav-btn nav-btn-lt ti-arrow-left"></i>',
        nextArrow: '<i class="nav-btn nav-btn-rt ti-arrow-right"></i>',

        responsive: [
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 3,
              infinite: true,
            },
          },
          {
            breakpoint: 400,
            settings: {
              slidesToShow: 2,
            },
          },
        ],
      });
    }
  });

  // Parallax background
  function bgParallax() {
    if ($('.parallax').length) {
      $('.parallax').each(function () {
        var height = $(this).position().top;
        var resize = height - $(window).scrollTop();
        var doParallax = -(resize / 5);
        var positionValue = doParallax + 'px';
        var img = $(this).data('bg-image');

        $(this).css({
          backgroundImage: 'url(' + img + ')',
          backgroundPosition: '50%' + positionValue,
          backgroundSize: 'cover',
        });
      });
    }
  }

  // HERO SLIDER
  var menu = [];
  jQuery('.swiper-slide').each(function (index) {
    menu.push(jQuery(this).find('.slide-inner').attr('data-text'));
  });
  var interleaveOffset = 0.5;
  var swiperOptions = {
    loop: true,
    speed: 1000,
    parallax: true,
    autoplay: {
      delay: 6500,
      disableOnInteraction: false,
    },
    watchSlidesProgress: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    on: {
      progress: function () {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          var slideProgress = swiper.slides[i].progress;
          var innerOffset = swiper.width * interleaveOffset;
          var innerTranslate = slideProgress * innerOffset;
          swiper.slides[i].querySelector('.slide-inner').style.transform =
            'translate3d(' + innerTranslate + 'px, 0, 0)';
        }
      },

      touchStart: function () {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          swiper.slides[i].style.transition = '';
        }
      },

      setTransition: function (speed) {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          swiper.slides[i].style.transition = speed + 'ms';
          swiper.slides[i].querySelector('.slide-inner').style.transition = speed + 'ms';
        }
      },
    },
  };

  // var swiper = new Swiper(".swiper-container", swiperOptions);

  // DATA BACKGROUND IMAGE
  var sliderBgSetting = $('.slide-bg-image');
  sliderBgSetting.each(function (indx) {
    if ($(this).attr('data-background')) {
      $(this).css('background-image', 'url(' + $(this).data('background') + ')');
    }
  });

  /*------------------------------------------
        = HIDE PRELOADER
    -------------------------------------------*/
  function preloader() {
    if ($('.preloader').length) {
      $('.preloader')
        .delay(100)
        .fadeOut(500, function () {
          //active wow
          wow.init();
        });
    }
  }

  /*------------------------------------------
        = WOW ANIMATION SETTING
    -------------------------------------------*/
  var wow = new WOW({
    boxClass: 'wow', // default
    animateClass: 'animated', // default
    offset: 0, // default
    mobile: true, // default
    live: true, // default
  });

  /*------------------------------------------
        = ACTIVE POPUP IMAGE
    -------------------------------------------*/
  if ($('.fancybox').length) {
    $('.fancybox').fancybox({
      openEffect: 'elastic',
      closeEffect: 'elastic',
      wrapCSS: 'project-fancybox-title-style',
    });
  }

  /*------------------------------------------
        = POPUP VIDEO
    -------------------------------------------*/
  if ($('.video-btn').length) {
    $('.video-btn').on('click', function () {
      $.fancybox({
        href: this.href,
        type: $(this).data('type'),
        title: this.title,
        helpers: {
          title: {
            type: 'inside',
          },
          media: {},
        },

        beforeShow: function () {
          $('.fancybox-wrap').addClass('gallery-fancybox');
        },
      });
      return false;
    });
  }

  /*------------------------------------------
        = ACTIVE GALLERY POPUP IMAGE
    -------------------------------------------*/
  if ($('.popup-gallery').length) {
    $('.popup-gallery').magnificPopup({
      delegate: 'a',
      type: 'image',

      gallery: {
        enabled: true,
      },

      zoom: {
        enabled: true,

        duration: 300,
        easing: 'ease-in-out',
        opener: function (openerElement) {
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        },
      },
    });
  }

  /*------------------------------------------
        = FUNCTION FORM SORTING GALLERY
    -------------------------------------------*/
  function sortingGallery() {
    if ($('.sortable-gallery .gallery-filters').length) {
      var $container = $('.gallery-container');
      $container.isotope({
        filter: '*',
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false,
        },
      });

      $('.gallery-filters li a').on('click', function () {
        $('.gallery-filters li .current').removeClass('current');
        $(this).addClass('current');
        var selector = $(this).attr('data-filter');
        $container.isotope({
          filter: selector,
          animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false,
          },
        });
        return false;
        service - slider;
      });
    }
  }

  sortingGallery();

  /*------------------------------------------
        = MASONRY GALLERY SETTING
    -------------------------------------------*/
  function masonryGridSetting() {
    if ($('.masonry-gallery').length) {
      var $grid = $('.masonry-gallery').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        percentPosition: true,
      });

      $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
      });
    }
  }

  // masonryGridSetting();

  /*------------------------------------------
        = FUNFACT
    -------------------------------------------*/
  if ($('.odometer').length) {
    $('.odometer').appear();
    $(document.body).on('appear', '.odometer', function (e) {
      var odo = $('.odometer');
      odo.each(function () {
        var countNumber = $(this).attr('data-count');
        $(this).html(countNumber);
      });
    });
  }

  /*------------------------------------------
        = STICKY HEADER
    -------------------------------------------*/

  // Function for clone an element for sticky menu
  function cloneNavForSticyMenu($ele, $newElmClass) {
    $ele
      .addClass('original')
      .clone()
      .insertAfter($ele)
      .addClass($newElmClass)
      .removeClass('original');
  }

  // clone home style 1 navigation for sticky menu
  if ($('.wpo-site-header .navigation').length) {
    cloneNavForSticyMenu($('.wpo-site-header .navigation'), 'sticky-header');
  }

  var lastScrollTop = '';

  function stickyMenu($targetMenu, $toggleClass) {
    var st = $(window).scrollTop();
    var mainMenuTop = $('.wpo-site-header .navigation');

    if ($(window).scrollTop() > 1000) {
      if (st > lastScrollTop) {
        // hide sticky menu on scroll down
        $targetMenu.removeClass($toggleClass);
      } else {
        // active sticky menu on scroll up
        $targetMenu.addClass($toggleClass);
      }
    } else {
      $targetMenu.removeClass($toggleClass);
    }

    lastScrollTop = st;
  }

  /*------------------------------------------
            = Header search toggle
        -------------------------------------------*/
  if ($('.header-search-form-wrapper').length) {
    var searchToggleBtn = $('.search-toggle-btn');
    var searchToggleBtnIcon = $('.search-toggle-btn i');
    var searchContent = $('.header-search-form');
    var body = $('body');

    searchToggleBtn.on('click', function (e) {
      searchContent.toggleClass('header-search-content-toggle');
      searchToggleBtnIcon.toggleClass('fi flaticon-loupe fi ti-close');
      e.stopPropagation();
    });

    body
      .on('click', function () {
        searchContent.removeClass('header-search-content-toggle');
      })
      .find(searchContent)
      .on('click', function (e) {
        e.stopPropagation();
      });
  }

  /*------------------------------------------
        = Header shopping cart toggle
    -------------------------------------------*/
  if ($('.mini-cart').length) {
    var cartToggleBtn = $('.cart-toggle-btn');
    var cartContent = $('.mini-cart-content');
    var cartCloseBtn = $('.mini-cart-close');
    var body = $('body');

    cartToggleBtn.on('click', function (e) {
      cartContent.toggleClass('mini-cart-content-toggle');
      e.stopPropagation();
    });

    cartCloseBtn.on('click', function (e) {
      cartContent.removeClass('mini-cart-content-toggle');
      e.stopPropagation();
    });

    body
      .on('click', function () {
        cartContent.removeClass('mini-cart-content-toggle');
      })
      .find(cartContent)
      .on('click', function (e) {
        e.stopPropagation();
      });
  }

  /*------------------------------------------
        = RECENT CASE SECTION SHOW HIDE
    -------------------------------------------*/
  if ($('.service-thumbs').length) {
    $('.service-thumb').on('click', function (e) {
      e.preventDefault();
      var target = $($(this).attr('data-case'));
      $('.service-thumb').removeClass('active-thumb');
      $(this).addClass('active-thumb');
      $('.service-content .service-data').hide(0);
      $('.service-data').fadeOut(300).removeClass('active-service-data');
      $(target).fadeIn(300).addClass('active-service-data');
    });
  }

  /*------------------------------------------
        = Testimonial SLIDER
    -------------------------------------------*/
  if ($('.wpo-testimonial-wrap').length) {
    $('.wpo-testimonial-wrap').owlCarousel({
      autoplay: false,
      smartSpeed: 300,
      margin: 20,
      loop: true,
      fade: true,
      autoplayHoverPause: true,
      dots: true,
      nav: false,
      items: 1,
    });
  }
  /*------------------------------------------
        = Testimonial SLIDER
    -------------------------------------------*/
  if ($('.wpo-service-slider').length) {
    $('.wpo-service-slider').owlCarousel({
      autoplay: false,
      smartSpeed: 300,
      margin: 20,
      loop: true,
      autoplayHoverPause: true,
      dots: true,
      nav: false,
      responsive: {
        0: {
          items: 1,
          dots: true,
          nav: false,
        },

        500: {
          items: 1,
          dots: true,
          nav: false,
        },

        768: {
          items: 2,
        },

        1200: {
          items: 3,
        },

        1400: {
          items: 4,
        },
      },
    });
  }
  /*------------------------------------------
        = Testimonial SLIDER
    -------------------------------------------*/
  if ($('.wpo-happy-client-slide').length) {
    $('.wpo-happy-client-slide').owlCarousel({
      autoplay: true,
      smartSpeed: 300,
      margin: 0,
      loop: true,
      autoplayHoverPause: true,
      dots: false,
      nav: false,
      items: 4,
    });
  }

  /*------------------------------------------
        = POST SLIDER
    -------------------------------------------*/
  if ($('.post-slider'.length)) {
    $('.post-slider').owlCarousel({
      mouseDrag: false,
      smartSpeed: 500,
      margin: 30,
      loop: true,
      nav: true,
      navText: ['<i class="fi ti-arrow-left"></i>', '<i class="fi ti-arrow-right"></i>'],
      dots: false,
      items: 1,
    });
  }

  /*------------------------------------------
        = TOUCHSPIN FOR PRODUCT SINGLE PAGE
    -------------------------------------------*/
  if ($("input[name='product-count']").length) {
    $("input[name='product-count']").TouchSpin({
      verticalbuttons: true,
    });
  }

  /*-----------------------
       cart-plus-minus-button 
     -------------------------*/
  $('.cart-plus-minus').append(
    '<div class="dec qtybutton">-</div><div class="inc qtybutton">+</div>',
  );
  $('.qtybutton').on('click', function () {
    var $button = $(this);
    var oldValue = $button.parent().find('input').val();
    if ($button.text() == '+') {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    $button.parent().find('input').val(newVal);
  });

  /*------------------------------------------
        = BACK TO TOP BTN SETTING
    -------------------------------------------*/
  $('body').append("<a href='#' class='back-to-top'><i class='ti-arrow-up'></i></a>");

  function toggleBackToTopBtn() {
    var amountScrolled = 1000;
    if ($(window).scrollTop() > amountScrolled) {
      $('a.back-to-top').fadeIn('slow');
    } else {
      $('a.back-to-top').fadeOut('slow');
    }
  }

  $('.back-to-top').on('click', function () {
    $('html,body').animate(
      {
        scrollTop: 0,
      },
      700,
    );
    return false;
  });

  /*------------------------------------------
        = CONTACT FORM SUBMISSION
    -------------------------------------------*/
  if ($('#contact-form-main').length) {
    $('#contact-form-main').validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
        },

        email: 'required',

        phone: 'required',

        subject: {
          required: true,
        },
      },

      messages: {
        name: 'Please enter your name',
        email: 'Please enter your email address',
        phone: 'Please enter your phone number',
        subject: 'Please select your contact subject',
      },

      submitHandler: function (form) {
        $.ajax({
          type: 'POST',
          url: 'mail-contact.php',
          data: $(form).serialize(),
          success: function () {
            $('#loader').hide();
            $('#success').slideDown('slow');
            setTimeout(function () {
              $('#success').slideUp('slow');
            }, 3000);
            form.reset();
          },
          error: function () {
            $('#loader').hide();
            $('#error').slideDown('slow');
            setTimeout(function () {
              $('#error').slideUp('slow');
            }, 3000);
          },
        });
        return false; // required to block normal submit since you used ajax
      },
    });
  }

  /*------------------------------------------
        = CONTACT FORM SUBMISSION2
    -------------------------------------------*/
  if ($('#consultancy-form,#contact-form').length) {
    $('#consultancy-form,#contact-form').validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
        },

        email: 'required',

        phone: 'required',

        subject: {
          required: true,
        },
      },

      messages: {
        name: 'Please enter your name',
        email: 'Please enter your email address',
        phone: 'Please enter your phone number',
        subject: 'Please select your contact subject',
      },

      submitHandler: function (form) {
        $.ajax({
          type: 'POST',
          url: 'mail-contact.php',
          data: $(form).serialize(),
          success: function () {
            $('#loader').hide();
            $('#success').slideDown('slow');
            setTimeout(function () {
              $('#success').slideUp('slow');
            }, 3000);
            form.reset();
          },
          error: function () {
            $('#loader').hide();
            $('#error').slideDown('slow');
            setTimeout(function () {
              $('#error').slideUp('slow');
            }, 3000);
          },
        });
        return false; // required to block normal submit since you used ajax
      },
    });
  }

  /*==========================================================================
        WHEN DOCUMENT LOADING
    ==========================================================================*/
  $(window).on('load', function () {
    preloader();

    sortingGallery();

    toggleMobileNavigation();

    smallNavFunctionality();
  });

  /*==========================================================================
        WHEN WINDOW SCROLL
    ==========================================================================*/
  $(window).on('scroll', function () {
    if ($('.site-header').length) {
      stickyMenu($('.site-header .navigation'), 'sticky-on');
    }

    toggleBackToTopBtn();
  });

  /*==========================================================================
        WHEN WINDOW RESIZE
    ==========================================================================*/
  $(window).on('resize', function () {
    toggleClassForSmallNav();
    //smallNavFunctionality();

    clearTimeout($.data(this, 'resizeTimer'));
    $.data(
      this,
      'resizeTimer',
      setTimeout(function () {
        smallNavFunctionality();
      }, 200),
    );
  });

  $('#dataTables').DataTable({
    scrollX: true,
    columnDefs: [
      {
        targets: '_all', // Atur untuk semua kolom
        className: 'text-center', // Tambahkan kelas CSS untuk menyelaraskan teks
      },
      {
        targets: -1, // Target kolom aksi (misalnya kolom terakhir)
        width: '100px', // Atur lebar kolom sesuai kebutuhan
        className: 'text-center', // Tambahkan align tengah jika diperlukan
      },
    ],
  });

  $('#dt-product').DataTable({
    serverSide: true,
    processing: true,
    ajax: {
      url: '/panel/products', // URL yang mengarah ke endpoint API Anda
      type: 'GET',
      data: function (d) {
        d.start = d.start || 0; // Offset untuk pagination
        d.length = d.length || 10; // Limit pagination
      },
    },
    columns: [
      {
        data: null, // Kolom untuk nomor urut
        render: function (data, type, row, meta) {
          return meta.row + 1; // Menampilkan nomor urut dimulai dari 1
        },
      },
      { data: 'name' },
      { data: 'description' },
      { data: 'price' },
      { data: 'category' },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-column align-items-center gap-1">
              <a class="btn btn-sm btn-primary w-100" href="/panel/products/edit/${row.id}">Edit</a>
              <a class="btn btn-sm btn-danger delete-btn w-100" href="/panel/products/delete/${row.id}">Hapus</a>
            </div>
          `;
        },
      },
    ],
    scrollX: true,
    columnDefs: [
      {
        targets: '_all', // Atur untuk semua kolom
        className: 'text-center', // Tambahkan kelas CSS untuk menyelaraskan teks
      },
      {
        targets: -1, // Target kolom aksi (misalnya kolom terakhir)
        width: '100px', // Atur lebar kolom sesuai kebutuhan
        className: 'text-center', // Tambahkan align tengah jika diperlukan
      },
    ],
  });

  $('#dt-product').on('click', '.delete-btn', function (e) {
    e.preventDefault(); // Prevent default anchor click behavior

    const href = $(this).attr('href'); // Get the href attribute

    // Show SweetAlert2 confirmation popup
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda tidak dapat mengembalikan data ini lagi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, navigate to the href
        window.location.href = href;
      }
    });
  });

  $('#dt-user').DataTable({
    serverSide: true,
    processing: true,
    ajax: {
      url: '/panel/members',
      type: 'GET',
      data: function (d) {
        d.start = d.start || 0;
        d.length = d.length || 10;
      },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      { data: 'email' },
      { data: 'nama' },
      { data: 'no_telp' },
      {
        data: 'status',
        render: function (data) {
          return `<span class="badge rounded-pill ${data === 'active' ? 'bg-success' : 'bg-danger'}">${data}</span>`;
        },
      },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-column gap-2">
              <a class="w-100 btn btn-sm btn-primary" href="/panel/members/edit/${row.id}">Edit</a>
              ${row.status === 'inactive' ? `<a class="w-100 btn btn-sm btn-success" href="/panel/members/verify/${row.id}">Verifikasi</a>` : `<a class="w-100 btn btn-sm btn-warning delete-btn" href="/panel/members/suspend/${row.id}">Suspend</a>`}
              <a class="w-100 btn btn-sm btn-danger delete-btn" href="/panel/members/delete/${row.id}">Hapus</a>
            </div>
          `;
        },
      },
    ],
    scrollX: true,
    columnDefs: [
      {
        targets: '_all',
        className: 'text-center',
      },
      {
        targets: -1,
        width: '100px',
        className: 'text-center',
      },
    ],
  });

  $('#dt-user').on('click', '.delete-btn', function (e) {
    e.preventDefault(); // Prevent default anchor click behavior

    const href = $(this).attr('href'); // Get the href attribute

    // Show SweetAlert2 confirmation popup
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda tidak dapat mengembalikan data ini lagi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, navigate to the href
        window.location.href = href;
      }
    });
  });

  $('#dt-category').DataTable({
    serverSide: true,
    processing: true,
    ajax: {
      url: '/panel/category',
      type: 'GET',
      data: function (d) {
        d.start = d.start || 0;
        d.length = d.length || 10;
      },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      { data: 'name' },
      { data: 'description' },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-column gap-2">
              <a class="w-100 btn btn-sm btn-primary" href="/panel/category/edit/${row.id}">Edit</a>
              <a class="w-100 btn btn-sm btn-danger delete-btn" href="/panel/category/delete/${row.id}">Hapus</a>
            </div>
          `;
        },
      },
    ],
    scrollX: true,
    columnDefs: [
      {
        targets: '_all',
        className: 'text-center',
      },
      {
        targets: -1,
        width: '100px',
        className: 'text-center',
      },
    ],
  });

  $('#dt-category').on('click', '.delete-btn', function (e) {
    e.preventDefault(); // Prevent default anchor click behavior

    const href = $(this).attr('href'); // Get the href attribute

    // Show SweetAlert2 confirmation popup
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda tidak dapat mengembalikan data ini lagi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, navigate to the href
        window.location.href = href;
      }
    });
  });

  $('#dt-location').DataTable({
    serverSide: true,
    processing: true,
    ajax: {
      url: '/panel/location',
      type: 'GET',
      data: function (d) {
        d.start = d.start || 0;
        d.length = d.length || 10;
      },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: 'thumbnail',
        render: function (data, type, row) {
          return `
            <div style="width: 125px; height: 85px; overflow: hidden;">
              <img src="${data}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          `;
        },
      },
      { data: 'name' },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-column gap-2">
              <a class="w-100 btn btn-sm btn-primary" href="/panel/location/edit/${row.id}">Edit</a>
              <a class="w-100 btn btn-sm btn-danger delete-btn" href="/panel/location/delete/${row.id}">Hapus</a>
            </div>
          `;
        },
      },
    ],
    scrollX: true,
    columnDefs: [
      {
        targets: '_all',
        className: 'text-center',
      },
      {
        targets: 0,
        width: '80px',
        className: 'text-center',
      },
      {
        targets: 1,
        width: '150px',
        className: 'text-center',
      },
      {
        targets: -1,
        width: '100px',
        className: 'text-center',
      },
    ],
  });

  $('#dt-category').on('click', '.delete-btn', function (e) {
    e.preventDefault(); // Prevent default anchor click behavior

    const href = $(this).attr('href'); // Get the href attribute

    // Show SweetAlert2 confirmation popup
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda tidak dapat mengembalikan data ini lagi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, navigate to the href
        window.location.href = href;
      }
    });
  });

  $('.language, .specialInterestSelect2, .availableAreasSelect2, .inclusions, .exclusions').select2(
    {
      width: '100%',
      tags: true,
    },
  );

  $('.delete-btn').on('click', function (e) {
    e.preventDefault(); // Prevent default anchor click behavior

    const href = $(this).attr('href'); // Get the href attribute

    // Show SweetAlert2 confirmation popup
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Anda tidak dapat mengembalikan data ini lagi!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, navigate to the href
        window.location.href = href;
      }
    });
  });

  $('#photo').on('change', function (event) {
    const files = event.target.files;
    const previewContainer = $('#preview-container');
    const previewBoxes = previewContainer.find('.preview-box');

    if (files.length > 5) {
      Swal.fire({
        title: 'Oops...',
        text: 'Anda hanya dapat mengunggah maksimal 5 file.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    previewBoxes.find('img').remove();
    previewBoxes.find('span').remove();
    // Loop through files and handle each file preview
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file && file instanceof Blob) {
        const reader = new FileReader();

        if (i == 3 && files.length - 4 != 0) {
          console.log(previewBoxes[i]);
          $(previewBoxes[i]).html(`<span class="more-indicator">+${files.length - 4}</span>`);
        }

        reader.onload = function (e) {
          // Find the correct preview box and insert image
          $(previewBoxes[i]).append(
            `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" />`,
          );
        };

        reader.readAsDataURL(file); // Read file as data URL
      }
    }
  });

  // filter directories
  $('#provinceSelect').on('change', function () {
    const selectedProvince = $(this).val();

    $('.card').each(function () {
      const instance = $(this).find('h4').text();

      if (selectedProvince === '' || instance.includes(selectedProvince)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
  $('#resetButton').on('click', function () {
    $('#provinceSelect').val(''); // Reset dropdown ke pilihan awal
    $('.card').show(); // Menampilkan semua card
  });

  // quil
  const editors = {};

  ['experience', 'educations'].forEach((id) => {
    const element = document.querySelector(`#${id}`);
    if (element) {
      editors[id] = new Quill(element, { theme: 'snow' });

      const hiddenInput = document.querySelector(`input[name="${id}"]`);
      if (hiddenInput && hiddenInput.value.trim()) {
        editors[id].root.innerHTML = hiddenInput.value.trim();
      }
    }
  });

  // Event Listener untuk Submit
  $('#personalProfileForm').on('submit', function (e) {
    e.preventDefault(); // Cegah submit otomatis untuk debug

    // Salin data dari Quill ke input hidden
    $.each(editors, function (name, editor) {
      $(`input[name="${name}"]`).val(editor.root.innerHTML.trim());
    });

    // Debug untuk cek data sebelum submit
    console.log('Experience:', $('input[name="experience"]').val());
    console.log('Educations:', $('input[name="educations"]').val());

    // Submit ulang form setelah data terisi
    this.submit();
  });

  let dayCount = $('#itinerary-container .accordion-item').length || 0;

  $('#add-day').click(function () {
    const dayTemplate = `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${dayCount}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${dayCount}" aria-expanded="false" aria-controls="collapse${dayCount}">
              Step - ${dayCount + 1}
            </button>
          </h2>
          <div id="collapse${dayCount}" class="accordion-collapse collapse" aria-labelledby="heading${dayCount}" data-bs-parent="#itinerary-container">
            <div class="accordion-body">
              <div class="mb-2">
                <label>Judul Kegiatan</label>
                <input type="text" name="itineraries[${dayCount}][title]" class="form-control" required />
              </div>
              <div class="mb-2">
                <label>Deskripsi</label>
                <textarea name="itineraries[${dayCount}][description]" class="form-control" rows="2" required></textarea>
              </div>
              <div class="mb-2">
                <label>Waktu (HH:MM)</label>
                <input type="time" name="itineraries[${dayCount}][time]" class="form-control" required />
              </div>
              <button type="button" class="btn btn-danger btn-sm remove-day">Hapus</button>
            </div>
          </div>
        </div>`;

    $('#itinerary-container').append(dayTemplate);
    dayCount++;
  });

  $(document).on('click', '.remove-day', function () {
    $(this).closest('.accordion-item').remove();
    $('#itinerary-container .accordion-item').each(function (index) {
      $(this)
        .find('.accordion-button')
        .text(`Day ${index + 1}`);
    });
    dayCount--;
  });

  let typingTimer;
  const doneTypingInterval = 500; // Tunggu 500ms setelah user berhenti mengetik

  $('#filter-2').on('input change', 'input, .custom-select-guide .option', function () {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(function () {
      let formData = $('#filter-2').serialize(); // Ambil semua data form

      $('#guide-list').html('<p class="loading">Loading...</p>');

      $.ajax({
        url: '/search/guide',
        method: 'GET',
        data: formData,
        success: function (response) {
          console.log('Data fetched successfully', response);

          if (response.users && response.users.length > 0) {
            updateGuideList(response.users);
          } else {
            $('#guide-list').html('<p class="not-found">Tidak ada hasil ditemukan.</p>');
          }
        },
        error: function (xhr, status, error) {
          console.error('Error fetching data', error);
        },
      });
    }, doneTypingInterval);
  });

  $(document).on('click', '.custom-select-guide .select', function () {
    let container = $(this).closest('.custom-select-guide');

    // Tutup semua dropdown kecuali yang sedang diklik
    $('.options-container').not(container.find('.options-container')).hide();

    // Toggle dropdown yang diklik
    container.find('.options-container').toggle();
  });

  $(document).on('click', '.custom-select-guide .option', function () {
    let value = $(this).text();
    let container = $(this).closest('.custom-select-guide');

    // Update tampilan
    container.find('.select').text(value);
    container.find('.option').removeClass('selected');
    $(this).addClass('selected');

    // Update input hidden dan trigger change agar AJAX berjalan
    container.find('input[type="hidden"]').val(value).trigger('change');

    // Sembunyikan dropdown
    container.find('.options-container').hide();
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.custom-select-guide').length) {
      $('.options-container').hide();
    }
  });

  function updateGuideList(users) {
    let guideHTML = '';

    users.forEach((user) => {
      let stars = '';
      for (let i = 0; i < Math.floor(user.avgRating); i++) {
        stars += '<i class="fa fa-star" aria-hidden="true"></i>';
      }
      for (let i = Math.floor(user.avgRating); i < 5; i++) {
        stars += '<i class="fa fa-star-o" aria-hidden="true"></i>';
      }

      let badges = user.availableAreas
        .slice(0, 3)
        .map((area) => `<div class="badge">${area.name}</div>`)
        .join('');
      if (user.availableAreas.length > 3) {
        badges += '<div class="badge">...</div>';
      }

      guideHTML += `
            <a href="/profile/${user.id}" class="guide-item">
                <div class="img-holder">
                    <img src="${user.photo}" alt="guide image" />
                </div>
                <div class="guide-body">
                    <div class="guide-name">${user.nama}</div>
                    <div class="rating">
                        <div class="star">${stars}</div>
                        <span class="rating-metric">${user.avgRating}/5</span>
                    </div>
                    <span class="review-count">(${user.countReview} Review)</span>
                    <div class="d-flex gap-2 align-items-center">${badges}</div>
                    <div class="description">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.</p>
                    </div>
                </div>
            </a>`;
    });

    $('#guide-list').html(guideHTML);
  }

  $(document).on('click', '#reset-filter', function () {
    $('#filter-2')[0].reset();

    // Reset nilai input hidden dalam custom select
    $('.custom-select-guide input[type="hidden"]').val('');

    // Reset tampilan select custom
    $('.custom-select-guide .select').text('Language');
    $('.custom-select-guide .option').removeClass('selected');

    // Trigger perubahan untuk memperbarui hasil pencarian
    $('#filter-2').trigger('change');
  });
})(window.jQuery);
