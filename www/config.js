var API;
var bucket;
var AWS_MaxKeys 			=	500;
var AWS_Prefix 				=	'fileobservation/';
var AWS_SignedUrl_Expires 	=	900;

var AWS_AccessKeyId 		=	'AKIAJWSPOK7O3C2777DA';
var AWS_SecretAccessKey 	=	'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';
var AWS_Region 				=	'';
var AWS_BucketName 			=	'netaistracking';
//////////////////////////////////////////////////////////////////////////////
var branch					=	'production';
//////////////////////////////////////////////////////////////////////////////
if(branch == 'production')
{
	API 	= 'http://app.aistracking.com/api/';
	
	addcss("#version{ background: #2196f3; }");
}
else if(branch == 'developer')
{
	API 	= 	'http://app.aistracking.net/api/';
	VERSION +=	'-dev';
	
	addcss("#version{ background: #F44336; }");
}
else
{
	API 	= 	'http://localhost:11313/';
	VERSION +=	'-local';

	addcss("#version{ background: #F44336; }");
}