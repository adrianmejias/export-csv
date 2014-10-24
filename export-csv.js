// http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
;( function ( $ )
{
	$.fn.exportCSV = function ( options )
	{
		var defaults =
		{
			headers: [],
			filename: 'export.csv',
			ignore: [],
			server: null
		};
		var settings = $.extend ( defaults, options );
		return this.each ( function ( )
		{
			var $table = $ ( this );
			if ( $table.is ( 'table' ) )
			{
				var $thead = $table.find ( 'thead' );
				if ( $thead.length !== 0 )
				{
					$thead.find ( 'th' ).each ( function ( i )
					{
						// ignore entire column if needed
						var ignore = $ ( this ).data ( 'ignore' ) || false;
						if ( ignore === false )
						{
							var header = $.trim ( $ ( this ).text ( ) );
							settings.headers.push ( header );
						}
						else
						{
							settings.ignore.push ( i );
						}
					} );
				}
				// find container
				var $tbody = $table.find ( 'tbody' );
				if ( $tbody.length === 0 )
				{
					$tbody = $table;
				}
				var rows = $tbody.find ( 'tr' );
				// create comma separated data
				var csvFile = '';
				if ( settings.headers.length !== 0 )
				{
					csvFile += '"' + settings.headers.join ( '","' ) + '"\n';
				}
				$tbody.find ( 'tr' ).each ( function ( )
				{
					var rows = [];
					$ ( this ).find ( 'td' ).each ( function ( i )
					{
						if ( $.inArray ( i, settings.ignore ) !== 0 )
						{
							var td = $ ( this ).text ( );
							var innerValue = td === null ? '' : td.toString ( );
							if ( td instanceof Date )
							{
								innerValue = td.toLocaleString ( );
							}
							rows.push ( $.trim ( innerValue.replace ( /"/g, '""' ) ) );
						}
					} );
					csvFile += '"' + rows.join ( '","' ) + '"\n';
				} );
				// create blob to export
				var blob = new Blob ( [ csvFile ],
				{
					type: 'text/csv'
				} );
				var URL = ( window.URL || window.webkitURL || window.mozURL || window.msURL );
				var saveBlob = ( navigator.saveBlob || navigator.msSaveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob );
				// IE 10+
				if ( saveBlob )
				{
					saveBlob ( blob, settings.filename );
				}
				else
				{
					// browsers that support HTML5 download attribute
					var link = document.createElement ( 'a' );
					if ( link.download !== 'undefined' )
					{
						var url = URL.createObjectURL ( blob );
						//url = 'data:application/csv,' + encodeURIComponent ( csvFile );
						if ( $ ( '[data-csv]' ).length === 0 )
						{
							$ ( 'body' ).append (
								$ ( '<a>' ).attr ( {
									href: '#export-csv',
									target: '_blank',
									id: 'data-csv',
									'data-csv': 'true'
								} ).text ( 'Export to CSV' ).hide ( )
							);
						}
						// this is needed for the native call to work - i don't even
						$ ( '[data-csv]' ).attr ( {
							href: url,
							download: settings.filename,
						} ).click ( );
						// native javascript FTW
						document.getElementById ( 'data-csv' ).click ( );
						// most likely won't need to use this
						//window.setTimeout ( function ( )
						//{
							//URL.revokeObjectURL ( $ ( '[data-csv]' ).attr ( 'href' ) );
						//}, 250 );
					}
					else
					{
						// you'll need to implement server side export
						if ( settings.server )
						{
							settings.server ( csvFile, settings.filename );
						}
					}
				}
			}
		} );
	}
} ) ( jQuery );