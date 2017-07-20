/*
paginateTable 1.2
Copyright 2010-2011,  Matthew Page
licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

Thanks to Greg Pedder for the page number feature.
Thanks to Leon for the fix related to table changes.
*/
(function ($) {
  /*
    Takes a table full of rows and only displays a subset of rows a page at a time.
    Responds to next page and previous page clicks to change the displayed page.
    Displays total pages and current page. 
    Hides pager if only a single page of rows.
    
    Example:
    
    <table id="myTable">
     <tbody>
        <tr><td>Apples</td></tr>
        <tr><td>Biscuits</td></tr>
        <tr><td>Cabbages</td></tr>
        <tr><td>Dumplings</td></tr>
        <tr><td>Eggs</td></tr>
        <tr><td>Flan</td></tr>
        <tr><td>Goose</td></tr>
        <tr><td>Ham</td></tr>
     <tbody>
    </table>
    <div class='pager'>
        <a href='#' alt='Previous' class='prevPage'>Prev</a>
        <span class='pageNumbers'></span>
        <span class='currentPage'></span> of <span class='totalPages'></span>
        <a href='#' alt='Next' class='nextPage'>Next</a>
    </div>
    
    <script>
    
    $(document).ready(function () {
        $('#myTable').paginateTable({ rowsPerPage: 2 });
    });
    </script>
    
    
    Or if you would rather have page numbers instead of the previous/next links:
    
    <div class='pager'>
        <span class='pageNumbers'></span>
    </div>
    
    Feel free to add rows to your tables. Just call paginateTable again. 
     
     var myTable = $('#myTable');
     myTable.paginateTable({ rowsPerPage: 2 }); 
     myTable.children('tbody').append('<tr><td>Hi</td></tr>');
     myTable.paginateTable({ rowsPerPage: 2 }); 
  */
  $.fn.paginateTable = function(options) {
  
      var settings = jQuery.extend({
          rowsPerPage: 5,               /* the number of rows that comprise a page */
          nextPage: ".nextPage", 		/* selector for "Next Page" dom element. Click to change page. */
          prevPage: ".prevPage",		/* selector for "Previous Page" dom element. Click to change page. */ 
          currentPage: ".currentPage",	/* selector for "Current Page" dom element. Display only. */
          totalPages: ".totalPages",	/* selector for "Total Pages" dom element. Display only. */
          pageNumbers: ".pageNumbers",  /* selector for container for autogenerated page number links */
          pager: ".pager",		        /* selector for container of all paging dom elements */
          autoHidePager: true		    /* hides the pager (see selector above) if there is only a single page */
      }, options || {});
  
      return this.each(function(){
          
          var table = $(this);
          var pager = $(settings.pager);
          var nextPage = pager.find(settings.nextPage);
          var prevPage = pager.find(settings.prevPage);
          var currentPage = pager.find(settings.currentPage);
          nextPage.unbind('click');
          nextPage.click(function(){
                  var pageNum = getCurrentPage(currentPage.text());
                  displayPage(table, pageNum+1, settings);
                  return false;
              });
          prevPage.unbind('click');
          prevPage.click(function(){
                  var pageNum = getCurrentPage(currentPage.text());
                  displayPage(table, pageNum-1, settings);
                  return false;
              });
          
          displayPage(table, getCurrentPage(currentPage.text()), settings);
      });
  };
  
  function getCurrentPage(pageText){
      var pageNum = parseInt(pageText,10);
      if (isNaN(pageNum)){
          pageNum = 0;
      }
      return Math.max(1, pageNum);
  }

  function displayPage(table, pageNum, settings){
      pageNum = Math.max(1, pageNum);
      if (settings.rowsPerPage > 0){
          var rows = table.find("tbody tr");
          var totalPages = Math.ceil(rows.size() / settings.rowsPerPage);
          if (settings.autoHidePager && totalPages <= 1){
              $(settings.pager).hide();
          }
          else if (totalPages > 0){
              
              pageNum = Math.min(pageNum, totalPages);
              var rowStartIndex = (pageNum - 1) * settings.rowsPerPage;
              var rowEndIndex = pageNum * settings.rowsPerPage;
              $.each(rows, function(index, row){
                  if (index >= rowStartIndex && index < rowEndIndex){
                      $(row).show();
                  }
                  else{
                      $(row).hide();
                  }
              });
              
              var pager = $(settings.pager);
              pager.find(settings.currentPage).text(pageNum);
              pager.find(settings.totalPages).text(totalPages);
              
              var pageNumbers = pager.find(settings.pageNumbers);
              if (pageNumbers.size() > 0){
                   pageNumbers.empty();
                   for(var i = 1; i <= totalPages; i++) {
                       pageNumbers.append("<a href='#' id='" + i + "'>" + i + "</a>");
                   }
       
                   pageNumbers.children('a').click(function(){
                       displayPage(table, $(this).attr("id"), settings);
                       return false;
                   });
              }
          }
          
      }
  }
	
})(jQuery);