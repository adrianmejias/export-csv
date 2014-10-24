export-csv
==========

Export tabular data to CSV format.

Example tabular data and usage
------------

```html
<table>
<tr>
  <th>First Name</th>
  <th>Last Name</th>
  <th data-ignore="true">Date of Birth</th>
</tr>
<tr>
	<td>John</td>
	<td>Doe</td>
	<td>03/11/1983</td>
</tr>
</table>
<button type="button">Export to CSV</button>
```

```javascript
$('button').click(function(){
	$('table').exportCSV();
});
```

To ``ignore columns``, you will need to add ``data-ignore`` tag to the header (th) column that you wish to be ignored.

Available options
------------

* ``headers``: **array** Create your own headers or use already displayed headers.
* ``filename``: **string** Custom filename for downloading exported file.
* ``ignore``: **array** Ignore columns by header itr as 0-??
* ``server``: **object** Used as a fallback to export CSV server-side.

```javascript
$('table').exportCSV({
  headers: ['First Name', 'Last Name', 'Birthdate'],
  filename: 'export.csv',
  ignore: [2],
  servrr: function (){}
});
```