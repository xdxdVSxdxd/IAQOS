<?php

function rrmdir($dir) {
	// echo("[rrmdir:" . $dir . "]");
   if (is_dir($dir)) { 
   	// echo("[rrmdir:is dir]");
     $objects = scandir($dir); 
     foreach ($objects as $object) { 
     	// echo("[rrmdir:object:" . $object . "]");
       if ($object != "." && $object != "..") { 
         if (is_dir($dir."/".$object)){
         	// echo("[rrmdir: is dir --> going under]");
           rrmdir($dir."/".$object);
         } else {
         	// echo("[rrmdir:removing]");
           unlink($dir."/".$object); 
       	 }
       } 
     }
     // echo("[rrmdir:remove starting dir]");
     rmdir($dir); 
   } 
 }


function slugify($str) {
    $search = array('Ș', 'Ț', 'ş', 'ţ', 'Ş', 'Ţ', 'ș', 'ț', 'î', 'â', 'ă', 'Î', 'Â', 'Ă', 'ë', 'Ë');
    $replace = array('s', 't', 's', 't', 's', 't', 's', 't', 'i', 'a', 'a', 'i', 'a', 'a', 'e', 'E');
    $str = str_ireplace($search, $replace, strtolower(trim($str)));
    $str = preg_replace('/[^\w\d\-\ ]/', '', $str);
    $str = str_replace(' ', '_', $str);
    return preg_replace('/\-{2,}/', '_', $str);
}



function mime2ext($mime) {
    $mime_map = [
        'video/3gpp2'                                                               => '3g2',
        'video/3gp'                                                                 => '3gp',
        'video/3gpp'                                                                => '3gp',
        'application/x-compressed'                                                  => '7zip',
        'audio/x-acc'                                                               => 'aac',
        'audio/ac3'                                                                 => 'ac3',
        'application/postscript'                                                    => 'ai',
        'audio/x-aiff'                                                              => 'aif',
        'audio/aiff'                                                                => 'aif',
        'audio/x-au'                                                                => 'au',
        'video/x-msvideo'                                                           => 'avi',
        'video/msvideo'                                                             => 'avi',
        'video/avi'                                                                 => 'avi',
        'application/x-troff-msvideo'                                               => 'avi',
        'application/macbinary'                                                     => 'bin',
        'application/mac-binary'                                                    => 'bin',
        'application/x-binary'                                                      => 'bin',
        'application/x-macbinary'                                                   => 'bin',
        'image/bmp'                                                                 => 'bmp',
        'image/x-bmp'                                                               => 'bmp',
        'image/x-bitmap'                                                            => 'bmp',
        'image/x-xbitmap'                                                           => 'bmp',
        'image/x-win-bitmap'                                                        => 'bmp',
        'image/x-windows-bmp'                                                       => 'bmp',
        'image/ms-bmp'                                                              => 'bmp',
        'image/x-ms-bmp'                                                            => 'bmp',
        'application/bmp'                                                           => 'bmp',
        'application/x-bmp'                                                         => 'bmp',
        'application/x-win-bitmap'                                                  => 'bmp',
        'application/cdr'                                                           => 'cdr',
        'application/coreldraw'                                                     => 'cdr',
        'application/x-cdr'                                                         => 'cdr',
        'application/x-coreldraw'                                                   => 'cdr',
        'image/cdr'                                                                 => 'cdr',
        'image/x-cdr'                                                               => 'cdr',
        'zz-application/zz-winassoc-cdr'                                            => 'cdr',
        'application/mac-compactpro'                                                => 'cpt',
        'application/pkix-crl'                                                      => 'crl',
        'application/pkcs-crl'                                                      => 'crl',
        'application/x-x509-ca-cert'                                                => 'crt',
        'application/pkix-cert'                                                     => 'crt',
        'text/css'                                                                  => 'css',
        'text/x-comma-separated-values'                                             => 'csv',
        'text/comma-separated-values'                                               => 'csv',
        'application/vnd.msexcel'                                                   => 'csv',
        'application/x-director'                                                    => 'dcr',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   => 'docx',
        'application/x-dvi'                                                         => 'dvi',
        'message/rfc822'                                                            => 'eml',
        'application/x-msdownload'                                                  => 'exe',
        'video/x-f4v'                                                               => 'f4v',
        'audio/x-flac'                                                              => 'flac',
        'video/x-flv'                                                               => 'flv',
        'image/gif'                                                                 => 'gif',
        'application/gpg-keys'                                                      => 'gpg',
        'application/x-gtar'                                                        => 'gtar',
        'application/x-gzip'                                                        => 'gzip',
        'application/mac-binhex40'                                                  => 'hqx',
        'application/mac-binhex'                                                    => 'hqx',
        'application/x-binhex40'                                                    => 'hqx',
        'application/x-mac-binhex40'                                                => 'hqx',
        'text/html'                                                                 => 'html',
        'image/x-icon'                                                              => 'ico',
        'image/x-ico'                                                               => 'ico',
        'image/vnd.microsoft.icon'                                                  => 'ico',
        'text/calendar'                                                             => 'ics',
        'application/java-archive'                                                  => 'jar',
        'application/x-java-application'                                            => 'jar',
        'application/x-jar'                                                         => 'jar',
        'image/jp2'                                                                 => 'jp2',
        'video/mj2'                                                                 => 'jp2',
        'image/jpx'                                                                 => 'jp2',
        'image/jpm'                                                                 => 'jp2',
        'image/jpeg'                                                                => 'jpeg',
        'image/pjpeg'                                                               => 'jpeg',
        'application/x-javascript'                                                  => 'js',
        'application/json'                                                          => 'json',
        'text/json'                                                                 => 'json',
        'application/vnd.google-earth.kml+xml'                                      => 'kml',
        'application/vnd.google-earth.kmz'                                          => 'kmz',
        'text/x-log'                                                                => 'log',
        'audio/x-m4a'                                                               => 'm4a',
        'application/vnd.mpegurl'                                                   => 'm4u',
        'audio/midi'                                                                => 'mid',
        'application/vnd.mif'                                                       => 'mif',
        'video/quicktime'                                                           => 'mov',
        'video/x-sgi-movie'                                                         => 'movie',
        'audio/mpeg'                                                                => 'mp3',
        'audio/mpg'                                                                 => 'mp3',
        'audio/mpeg3'                                                               => 'mp3',
        'audio/mp3'                                                                 => 'mp3',
        'video/mp4'                                                                 => 'mp4',
        'video/mpeg'                                                                => 'mpeg',
        'application/oda'                                                           => 'oda',
        'audio/ogg'                                                                 => 'ogg',
        'video/ogg'                                                                 => 'ogg',
        'application/ogg'                                                           => 'ogg',
        'application/x-pkcs10'                                                      => 'p10',
        'application/pkcs10'                                                        => 'p10',
        'application/x-pkcs12'                                                      => 'p12',
        'application/x-pkcs7-signature'                                             => 'p7a',
        'application/pkcs7-mime'                                                    => 'p7c',
        'application/x-pkcs7-mime'                                                  => 'p7c',
        'application/x-pkcs7-certreqresp'                                           => 'p7r',
        'application/pkcs7-signature'                                               => 'p7s',
        'application/pdf'                                                           => 'pdf',
        'application/octet-stream'                                                  => 'pdf',
        'application/x-x509-user-cert'                                              => 'pem',
        'application/x-pem-file'                                                    => 'pem',
        'application/pgp'                                                           => 'pgp',
        'application/x-httpd-php'                                                   => 'php',
        'application/php'                                                           => 'php',
        'application/x-php'                                                         => 'php',
        'text/php'                                                                  => 'php',
        'text/x-php'                                                                => 'php',
        'application/x-httpd-php-source'                                            => 'php',
        'image/png'                                                                 => 'png',
        'image/x-png'                                                               => 'png',
        'application/powerpoint'                                                    => 'ppt',
        'application/vnd.ms-powerpoint'                                             => 'ppt',
        'application/vnd.ms-office'                                                 => 'ppt',
        'application/msword'                                                        => 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
        'application/x-photoshop'                                                   => 'psd',
        'image/vnd.adobe.photoshop'                                                 => 'psd',
        'audio/x-realaudio'                                                         => 'ra',
        'audio/x-pn-realaudio'                                                      => 'ram',
        'application/x-rar'                                                         => 'rar',
        'application/rar'                                                           => 'rar',
        'application/x-rar-compressed'                                              => 'rar',
        'audio/x-pn-realaudio-plugin'                                               => 'rpm',
        'application/x-pkcs7'                                                       => 'rsa',
        'text/rtf'                                                                  => 'rtf',
        'text/richtext'                                                             => 'rtx',
        'video/vnd.rn-realvideo'                                                    => 'rv',
        'application/x-stuffit'                                                     => 'sit',
        'application/smil'                                                          => 'smil',
        'text/srt'                                                                  => 'srt',
        'image/svg+xml'                                                             => 'svg',
        'application/x-shockwave-flash'                                             => 'swf',
        'application/x-tar'                                                         => 'tar',
        'application/x-gzip-compressed'                                             => 'tgz',
        'image/tiff'                                                                => 'tiff',
        'text/plain'                                                                => 'txt',
        'text/x-vcard'                                                              => 'vcf',
        'application/videolan'                                                      => 'vlc',
        'text/vtt'                                                                  => 'vtt',
        'audio/x-wav'                                                               => 'wav',
        'audio/wave'                                                                => 'wav',
        'audio/wav'                                                                 => 'wav',
        'application/wbxml'                                                         => 'wbxml',
        'video/webm'                                                                => 'webm',
        'audio/x-ms-wma'                                                            => 'wma',
        'application/wmlc'                                                          => 'wmlc',
        'video/x-ms-wmv'                                                            => 'wmv',
        'video/x-ms-asf'                                                            => 'wmv',
        'application/xhtml+xml'                                                     => 'xhtml',
        'application/excel'                                                         => 'xl',
        'application/msexcel'                                                       => 'xls',
        'application/x-msexcel'                                                     => 'xls',
        'application/x-ms-excel'                                                    => 'xls',
        'application/x-excel'                                                       => 'xls',
        'application/x-dos_ms_excel'                                                => 'xls',
        'application/xls'                                                           => 'xls',
        'application/x-xls'                                                         => 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'         => 'xlsx',
        'application/vnd.ms-excel'                                                  => 'xlsx',
        'application/xml'                                                           => 'xml',
        'text/xml'                                                                  => 'xml',
        'text/xsl'                                                                  => 'xsl',
        'application/xspf+xml'                                                      => 'xspf',
        'application/x-compress'                                                    => 'z',
        'application/x-zip'                                                         => 'zip',
        'application/zip'                                                           => 'zip',
        'application/x-zip-compressed'                                              => 'zip',
        'application/s-compressed'                                                  => 'zip',
        'multipart/x-zip'                                                           => 'zip',
        'text/x-scriptzsh'                                                          => 'zsh',
    ];

    return isset($mime_map[$mime]) ? $mime_map[$mime] : false;
}





function mime2folder($mime) {
    $mime_map = [
        'video/3gpp2'                                                               => 'VIDEO',
        'video/3gp'                                                                 => 'VIDEO',
        'video/3gpp'                                                                => 'VIDEO',
        'application/x-compressed'                                                  => 'ENTITIES',
        'audio/x-acc'                                                               => 'AUDIO',
        'audio/ac3'                                                                 => 'AUDIO',
        'application/postscript'                                                    => 'ENTITIES',
        'audio/x-aiff'                                                              => 'AUDIO',
        'audio/aiff'                                                                => 'AUDIO',
        'audio/x-au'                                                                => 'AUDIO',
        'video/x-msvideo'                                                           => 'VIDEO',
        'video/msvideo'                                                             => 'VIDEO',
        'video/avi'                                                                 => 'VIDEO',
        'application/x-troff-msvideo'                                               => 'VIDEO',
        'application/macbinary'                                                     => 'ENTITIES',
        'application/mac-binary'                                                    => 'ENTITIES',
        'application/x-binary'                                                      => 'ENTITIES',
        'application/x-macbinary'                                                   => 'ENTITIES',
        'image/bmp'                                                                 => 'IMAGES',
        'image/x-bmp'                                                               => 'IMAGES',
        'image/x-bitmap'                                                            => 'IMAGES',
        'image/x-xbitmap'                                                           => 'IMAGES',
        'image/x-win-bitmap'                                                        => 'IMAGES',
        'image/x-windows-bmp'                                                       => 'IMAGES',
        'image/ms-bmp'                                                              => 'IMAGES',
        'image/x-ms-bmp'                                                            => 'IMAGES',
        'application/bmp'                                                           => 'IMAGES',
        'application/x-bmp'                                                         => 'IMAGES',
        'application/x-win-bitmap'                                                  => 'IMAGES',
        'application/cdr'                                                           => 'IMAGES',
        'application/coreldraw'                                                     => 'IMAGES',
        'application/x-cdr'                                                         => 'IMAGES',
        'application/x-coreldraw'                                                   => 'IMAGES',
        'image/cdr'                                                                 => 'IMAGES',
        'image/x-cdr'                                                               => 'IMAGES',
        'zz-application/zz-winassoc-cdr'                                            => 'IMAGES',
        'application/mac-compactpro'                                                => 'ENTITIES',
        'application/pkix-crl'                                                      => 'ENTITIES',
        'application/pkcs-crl'                                                      => 'ENTITIES',
        'application/x-x509-ca-cert'                                                => 'ENTITIES',
        'application/pkix-cert'                                                     => 'ENTITIES',
        'text/css'                                                                  => 'TEXTS',
        'text/x-comma-separated-values'                                             => 'TEXTS',
        'text/comma-separated-values'                                               => 'TEXTS',
        'application/vnd.msexcel'                                                   => 'TEXTS',
        'application/x-director'                                                    => 'ENTITIES',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   => 'ENTITIES',
        'application/x-dvi'                                                         => 'ENTITIES',
        'message/rfc822'                                                            => 'ENTITIES',
        'application/x-msdownload'                                                  => 'ENTITIES',
        'video/x-f4v'                                                               => 'VIDEO',
        'audio/x-flac'                                                              => 'AUDIO',
        'video/x-flv'                                                               => 'VIDEO',
        'image/gif'                                                                 => 'IMAGES',
        'application/gpg-keys'                                                      => 'ENTITIES',
        'application/x-gtar'                                                        => 'ENTITIES',
        'application/x-gzip'                                                        => 'ENTITIES',
        'application/mac-binhex40'                                                  => 'ENTITIES',
        'application/mac-binhex'                                                    => 'ENTITIES',
        'application/x-binhex40'                                                    => 'ENTITIES',
        'application/x-mac-binhex40'                                                => 'ENTITIES',
        'text/html'                                                                 => 'TEXTS',
        'image/x-icon'                                                              => 'IMAGES',
        'image/x-ico'                                                               => 'IMAGES',
        'image/vnd.microsoft.icon'                                                  => 'IMAGES',
        'text/calendar'                                                             => 'TEXTS',
        'application/java-archive'                                                  => 'ENTITIES',
        'application/x-java-application'                                            => 'ENTITIES',
        'application/x-jar'                                                         => 'ENTITIES',
        'image/jp2'                                                                 => 'IMAGES',
        'video/mj2'                                                                 => 'VIDEO',
        'image/jpx'                                                                 => 'IMAGES',
        'image/jpm'                                                                 => 'IMAGES',
        'image/jpeg'                                                                => 'IMAGES',
        'image/pjpeg'                                                               => 'IMAGES',
        'application/x-javascript'                                                  => 'ENTITIES',
        'application/json'                                                          => 'ENTITIES',
        'text/json'                                                                 => 'ENTITIES',
        'application/vnd.google-earth.kml+xml'                                      => 'COORDINATES',
        'application/vnd.google-earth.kmz'                                          => 'COORDINATES',
        'text/x-log'                                                                => 'TEXTS',
        'audio/x-m4a'                                                               => 'AUDIO',
        'application/vnd.mpegurl'                                                   => 'AUDIO',
        'audio/midi'                                                                => 'AUDIO',
        'application/vnd.mif'                                                       => 'ENTITIES',
        'video/quicktime'                                                           => 'VIDEO',
        'video/x-sgi-movie'                                                         => 'VIDEO',
        'audio/mpeg'                                                                => 'AUDIO',
        'audio/mpg'                                                                 => 'AUDIO',
        'audio/mpeg3'                                                               => 'AUDIO',
        'audio/mp3'                                                                 => 'AUDIO',
        'video/mp4'                                                                 => 'VIDEO',
        'video/mpeg'                                                                => 'VIDEO',
        'application/oda'                                                           => 'ENTITIES',
        'audio/ogg'                                                                 => 'AUDIO',
        'video/ogg'                                                                 => 'VIDEO',
        'application/ogg'                                                           => 'AUDIO',
        'application/x-pkcs10'                                                      => 'ENTITIES',
        'application/pkcs10'                                                        => 'ENTITIES',
        'application/x-pkcs12'                                                      => 'ENTITIES',
        'application/x-pkcs7-signature'                                             => 'ENTITIES',
        'application/pkcs7-mime'                                                    => 'ENTITIES',
        'application/x-pkcs7-mime'                                                  => 'ENTITIES',
        'application/x-pkcs7-certreqresp'                                           => 'ENTITIES',
        'application/pkcs7-signature'                                               => 'ENTITIES',
        'application/pdf'                                                           => 'ENTITIES',
        'application/octet-stream'                                                  => 'ENTITIES',
        'application/x-x509-user-cert'                                              => 'ENTITIES',
        'application/x-pem-file'                                                    => 'ENTITIES',
        'application/pgp'                                                           => 'ENTITIES',
        'application/x-httpd-php'                                                   => 'ENTITIES',
        'application/php'                                                           => 'ENTITIES',
        'application/x-php'                                                         => 'ENTITIES',
        'text/php'                                                                  => 'ENTITIES',
        'text/x-php'                                                                => 'ENTITIES',
        'application/x-httpd-php-source'                                            => 'ENTITIES',
        'image/png'                                                                 => 'IMAGES',
        'image/x-png'                                                               => 'IMAGES',
        'application/powerpoint'                                                    => 'ENTITIES',
        'application/vnd.ms-powerpoint'                                             => 'ENTITIES',
        'application/vnd.ms-office'                                                 => 'ENTITIES',
        'application/msword'                                                        => 'ENTITIES',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'ENTITIES',
        'application/x-photoshop'                                                   => 'IMAGES',
        'image/vnd.adobe.photoshop'                                                 => 'IMAGES',
        'audio/x-realaudio'                                                         => 'AUDIO',
        'audio/x-pn-realaudio'                                                      => 'AUDIO',
        'application/x-rar'                                                         => 'ENTITIES',
        'application/rar'                                                           => 'ENTITIES',
        'application/x-rar-compressed'                                              => 'ENTITIES',
        'audio/x-pn-realaudio-plugin'                                               => 'ENTITIES',
        'application/x-pkcs7'                                                       => 'ENTITIES',
        'text/rtf'                                                                  => 'TEXTS',
        'text/richtext'                                                             => 'TEXTS',
        'video/vnd.rn-realvideo'                                                    => 'VIDEO',
        'application/x-stuffit'                                                     => 'ENTITIES',
        'application/smil'                                                          => 'ENTITIES',
        'text/srt'                                                                  => 'TEXTS',
        'image/svg+xml'                                                             => 'IMAGES',
        'application/x-shockwave-flash'                                             => 'ENTITIES',
        'application/x-tar'                                                         => 'ENTITIES',
        'application/x-gzip-compressed'                                             => 'ENTITIES',
        'image/tiff'                                                                => 'IMAGES',
        'text/plain'                                                                => 'TEXTS',
        'text/x-vcard'                                                              => 'TEXTS',
        'application/videolan'                                                      => 'ENTITIES',
        'text/vtt'                                                                  => 'TEXTS',
        'audio/x-wav'                                                               => 'AUDIO',
        'audio/wave'                                                                => 'AUDIO',
        'audio/wav'                                                                 => 'AUDIO',
        'application/wbxml'                                                         => 'ENTITIES',
        'video/webm'                                                                => 'VIDEO',
        'audio/x-ms-wma'                                                            => 'AUDIO',
        'application/wmlc'                                                          => 'ENTITIES',
        'video/x-ms-wmv'                                                            => 'VIDEO',
        'video/x-ms-asf'                                                            => 'VIDEO',
        'application/xhtml+xml'                                                     => 'TEXTS',
        'application/excel'                                                         => 'ENTITIES',
        'application/msexcel'                                                       => 'ENTITIES',
        'application/x-msexcel'                                                     => 'ENTITIES',
        'application/x-ms-excel'                                                    => 'ENTITIES',
        'application/x-excel'                                                       => 'ENTITIES',
        'application/x-dos_ms_excel'                                                => 'ENTITIES',
        'application/xls'                                                           => 'ENTITIES',
        'application/x-xls'                                                         => 'ENTITIES',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'         => 'ENTITIES',
        'application/vnd.ms-excel'                                                  => 'ENTITIES',
        'application/xml'                                                           => 'TEXTS',
        'text/xml'                                                                  => 'TEXTS',
        'text/xsl'                                                                  => 'ENTITIES',
        'application/xspf+xml'                                                      => 'ENTITIES',
        'application/x-compress'                                                    => 'ENTITIES',
        'application/x-zip'                                                         => 'ENTITIES',
        'application/zip'                                                           => 'ENTITIES',
        'application/x-zip-compressed'                                              => 'ENTITIES',
        'application/s-compressed'                                                  => 'ENTITIES',
        'multipart/x-zip'                                                           => 'ENTITIES',
        'text/x-scriptzsh'                                                          => 'ENTITIES',
    ];

    return isset($mime_map[$mime]) ? $mime_map[$mime] : false;
}





function utf8ize($d) {
    if (is_array($d)) 
        foreach ($d as $k => $v) 
            $d[$k] = utf8ize($v);

     else if(is_object($d))
        foreach ($d as $k => $v) 
            $d->$k = utf8ize($v);

     else 
        return utf8_encode($d);

    return $d;
}




function get_folder_for_mimetype($mimetype){
	$folder = "ENTITIES";

	return $folder;
}



function get_new_filename_for_file($folder,$extension){
	$n = 0;

	if ($handle = opendir($folder)) {

	    while (false !== ($entry = readdir($handle))) {
	        $entry = str_replace("." . $extension, "", $entry);
	        $n1 = intval($entry);
	        if($n1>$n){
	        	$n = $n1;
	        }
	    }
	    closedir($handle);
	}

	$n++;

	$filename = $n . "." . $extension;

	return $filename;
}


function create_domain($domain,$configuration){
	$dirname = $configuration["DOMAINS_DIR"] . "/" . $domain;
	if(!file_exists( $dirname)){
		mkdir( $dirname , 0777 , true  );
		mkdir( $dirname . "/IMAGES" , 0777 , true  );
		mkdir( $dirname . "/TEXTS" , 0777 , true  );
		mkdir( $dirname . "/COORDINATES" , 0777 , true  );
		mkdir( $dirname . "/ENTITIES" , 0777 , true  );
		mkdir( $dirname . "/SUBJECTS" , 0777 , true  );	
		mkdir( $dirname . "/AUDIO" , 0777 , true  );	
		mkdir( $dirname . "/VIDEO" , 0777 , true  );	
		mkdir( $dirname . "/MODELS" , 0777 , true  );
	}
}

?>