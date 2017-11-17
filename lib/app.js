(function($){

        var extensionsMap = {
                      ".zip" : "fa-file-archive-o",         
                      ".gz" : "fa-file-archive-o",         
                      ".bz2" : "fa-file-archive-o",         
                      ".xz" : "fa-file-archive-o",         
                      ".rar" : "fa-file-archive-o",         
                      ".tar" : "fa-file-archive-o",         
                      ".tgz" : "fa-file-archive-o",         
                      ".tbz2" : "fa-file-archive-o",         
                      ".z" : "fa-file-archive-o",         
                      ".7z" : "fa-file-archive-o",         
                      ".mp3" : "fa-file-audio-o",         
                      ".cs" : "fa-file-code-o",         
                      ".c++" : "fa-file-code-o",         
                      ".cpp" : "fa-file-code-o",         
                      ".js" : "fa-file-code-o",         
                      ".xls" : "fa-file-excel-o",         
                      ".xlsx" : "fa-file-excel-o",         
                      ".png" : "fa-file-image-o",         
                      ".jpg" : "fa-file-image-o",         
                      ".jpeg" : "fa-file-image-o",         
                      ".gif" : "fa-file-image-o",         
                      ".mpeg" : "fa-file-movie-o",         
                      ".pdf" : "fa-file-pdf-o",         
                      ".ppt" : "fa-file-powerpoint-o",         
                      ".pptx" : "fa-file-powerpoint-o",         
                      ".txt" : "fa-file-text-o",         
                      ".log" : "fa-file-text-o",         
                      ".doc" : "fa-file-word-o",         
                      ".docx" : "fa-file-word-o",         
                    };

  function getFileIcon(ext) {
    return ( ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
  }
  
   var currentPath = null;
   var options = {
        "bProcessing": true,
        "bServerSide": false,
        "bPaginate": false,
        "bAutoWidth": false,
         "sScrollY":"250px",
        "fnCreatedRow" :  function( nRow, aData, iDataIndex ) {
          if (!aData.IsDirectory) return;
          var path = encodeURIComponent(aData.Path);
          $(nRow).bind("click", function(e){
             $.get('/files?path='+ path).then(function(data){
              table.fnClearTable();
              table.fnAddData(data);
              currentPath = path;
            });
            e.preventDefault();
          });
        }, 
        "aoColumns": [
          { "sTitle": "", "mData": null, "bSortable": false, "sClass": "head0", "sWidth": "55px",
            "render": function (data, type, row, meta) {
              if (data.IsDirectory) {
                return "<a href='#' target='_blank'><i class='fa fa-folder'></i>&nbsp;" + data.Name +"</a>";
              } else {
                return "<a href='/" + encodeURIComponent(data.Path) + "' target='_blank'><i class='fa " + getFileIcon(data.Ext) + "'></i>&nbsp;" + data.Name +"</a>";
              }
            }
          }
        ]
   };

  var table = $(".linksholder").dataTable(options);

  $.get('/files').then(function(data){
      table.fnClearTable();
      table.fnAddData(data);
  });

  $(".up").bind("click", function(e){
    if (!currentPath) return;
    var idx = currentPath.lastIndexOf("%2F");
    var path =currentPath.substr(0, idx);
    $.get('/files?path='+ path).then(function(data){
        table.fnClearTable();
        table.fnAddData(data);
        currentPath = path;
    });
  });
})(jQuery);
