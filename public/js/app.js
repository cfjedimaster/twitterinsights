var $term, $analyzeButton, $results;

$(document).ready(function() {
	
	Highcharts.setOptions({
		colors: ['#0a905d', '#a1191b']
	});
	
	$term = $('#termInput');
	$analyzeButton = $('#analyzeButton');
	$results = $('#results');
	
	$analyzeButton.on('click', function() {
		//clear charts
		$('#chart1').html('');
		$('#chart2').html('');
		$('#chart3').html('');
		$('#chart4').html('');
		$('#chart5').html('');
		
		var term = $.trim($term.val());
		//remove nonalnum
		term = term.replace(/[^a-z0-9# ]/g, '');
		$term.val(term);
		if(term === '') return;
		$analyzeButton.attr('disabled','disabled').val('Working...');
		doAnalyze(term);
	});
	
});

function doAnalyze(t) {
	$.get('/analyze', {term:t}, function(res) {

		$analyzeButton.removeAttr('disabled').val('Analyze');

		//handle 0 for general
		if(res.positive === 0 && res.negative === 0) {
			alert('Sorry, no results were found.');
			return;
		}
		
		console.dir(res);
		//Ok, beging to build our totals
		
		$('#chart1').highcharts({
			chart:{
				plotBackgroundColor:null,
				plotBorderWidth:null,
				plotShadow:true,
				type:'pie'	
			},
			title:{
				text:'General Twitter Sentiment'	
			},
			tooltip: {
				pointFormatter:function() {
					return Highcharts.numberFormat(this.y, 0, '', ',');
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series:[{
				name:'Data',
				colorByPoint:true,
				data:[
					{name:'Positive', y:res.positive},{name:'Negative', y:res.negative}
				]
				
			}]
					
		});

		$('#chart2').highcharts({
			chart:{
				plotBackgroundColor:null,
				plotBorderWidth:null,
				plotShadow:true,
				type:'pie'	
			},
			title:{
				text:'Popular Twitter Users\' Sentiment'	
			},
			subtitle:{
				text:'Users with at least 5K followers'
			},
			tooltip: {
				pointFormatter:function() {
					return Highcharts.numberFormat(this.y, 0, '', ',');
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series:[{
				name:'Data',
				colorByPoint:true,
				data:[
					{name:'Positive', y:res.positive_high},{name:'Negative', y:res.negative_high}	
				]
				
			}]
					
		});

		$('#chart3').highcharts({
			chart:{
				plotBackgroundColor:null,
				plotBorderWidth:null,
				plotShadow:true,
				type:'pie'	
			},
			title:{
				text:'Married Twitter Users\' Sentiment'	
			},
			subtitle:{
				text:'Users who are (probably) married'
			},
			tooltip: {
				pointFormatter:function() {
					return Highcharts.numberFormat(this.y, 0, '', ',');
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series:[{
				name:'Data',
				colorByPoint:true,
				data:[
					{name:'Positive', y:res.positive_married},{name:'Negative', y:res.negative_married}	
				]
				
			}]
					
		});	
		
		$('#chart4').highcharts({
			chart:{
				plotBackgroundColor:null,
				plotBorderWidth:null,
				plotShadow:true,
				type:'pie'	
			},
			title:{
				text:'Twitter Users with Kids Sentiment'	
			},
			subtitle:{
				text:'Users who (probably) have kids'
			},
			tooltip: {
				pointFormatter:function() {
					return Highcharts.numberFormat(this.y, 0, '', ',');
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series:[{
				name:'Data',
				colorByPoint:true,
				data:[
					{name:'Positive', y:res.positive_children},{name:'Negative', y:res.negative_children}	
				]
				
			}]
					
		});	

		$('#chart5').highcharts({
			chart:{
				plotBackgroundColor:null,
				plotBorderWidth:null,
				plotShadow:true,
				type:'pie'	
			},
			title:{
				text:'General Sentiment over Last Year'	
			},
			tooltip: {
				pointFormatter:function() {
					return Highcharts.numberFormat(this.y, 0, '', ',');
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series:[{
				name:'Data',
				colorByPoint:true,
				data:[
					{name:'Positive', y:res.positive_lastyear},{name:'Negative', y:res.negative_lastyear}	
				]
				
			}]
					
		});						
	});
}