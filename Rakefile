require 'rake/clean'

CLOBBER.include('lib/mutil.js')

file 'lib/mutil.js' => FileList['lib/mutil/**/*.js'] do |t|
  base = File.read('lib/mutil/base.js').gsub(%r{^// require '([^']+)'$}) do |m|
    [m, File.read(File.join('lib', $1 + '.js'))].join("\n")
  end
  File.open(t.name, 'w') do |f|
    f.write base
  end
end