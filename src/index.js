angular
  .module('app', ['ui.router','uiGmapgoogle-maps']);




  jQuery(document).ready(function($) {
      $(".clickable-row").click(function() {
          window.document.location = $(this).data("href");
      });
  });
