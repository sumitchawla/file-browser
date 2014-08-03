(function($){

        var extensionsMap = {
                      ".zip" : "fa-file-archive-o",         
                      ".mp3" : "fa-file-audio-o",         
                      ".cs" : "fa-file-code-o",         
                      ".c++" : "fa-file-code-o",         
                      ".cpp" : "fa-file-code-o",         
                      ".js" : "fa-file-code-o",         
                      ".xls" : "fa-file-excel-o",         
                      ".png" : "fa-file-image-o",         
                      ".jpg" : "fa-file-image-o",         
                      ".jpeg" : "fa-file-image-o",         
                      ".gif" : "fa-file-image-o",         
                      ".mpeg" : "fa-file-movie-o",         
                      ".pdf" : "fa-file-pdf-o",         
                      ".ppt" : "fa-file-powerpoint-o",         
                      ".ppx" : "fa-file-powerpoint-o",         
                      ".txt" : "fa-file-text-o",         
                      ".doc" : "fa-file-word-o",         
                    };

  function getFileIcon(ext) {
    return extensionsMap[ext] || 'fa-file-o';
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
          var path = aData.Path;
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
                return "<a href='/" + data.File + "' target='_blank'><i class='fa " + getFileIcon(data.Ext) + "'></i>&nbsp;" + data.Name +"</a>";
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
    var idx = currentPath.lastIndexOf("/");
    var path =currentPath.substr(0, idx);
    $.get('/files?path='+ path).then(function(data){
        table.fnClearTable();
        table.fnAddData(data);
        currentPath = path;
    });
  });
})(jQuery);
