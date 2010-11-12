require 'rake/clean'

CLOBBER.include('lib/mutil.js')

def expand_requirements(path)
  File.read(path).gsub(%r{^([ \t]*)// require '([^']+)'$}) do |m|
    [m, indent(expand_requirements(File.join(File.dirname(path), $2 + '.js')), $1)].join("\n")
  end
end

def indent(string, whitespace)
  string.gsub(/^/, whitespace)
end

file 'lib/mutil.js' => FileList['lib/mutil/**/*.js'] do |t|
  File.open(t.name, 'w') do |f|
    f.write expand_requirements('lib/mutil/base.js')
  end
end

task :default => 'lib/mutil.js'