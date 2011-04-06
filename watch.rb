def expand_requirements(path)
  File.read(path).gsub(%r{^([ \t]*)// require '([^']+)'$}) do |m|
    [m, indent(expand_requirements(File.join(File.dirname(path), $2 + '.js')), $1)].join("\n")
  end
end

def indent(string, whitespace)
  string.gsub(/^/, whitespace)
end

watch('lib/mutil/(.+)\.js') do
  File.open('lib/mutil.js', 'w') do |f|
    f.write expand_requirements('lib/mutil/base.js')
  end
  print "\r-- Compiled lib/mutil.js [#{Time.now}]"
  STDOUT.flush
end