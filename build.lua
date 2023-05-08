siteF = io.output("index2.html")

function post (p)
	siteF:write("<a href='"..p.url.."'>")
	siteF:write("<div class='post'>")
	siteF:write("<h2>"..p.name.."</h2>")
	siteF:write("</a>")
	siteF:write("<p class='tag'>")
	for _,t in pairs(p.tags) do
		siteF:write("#"..t)
	end
	siteF:write("</div>")
end


startstub =  io.open("top.txt"):read("*a") -- string of whole top of site
endstub = io.open("bottom.txt"):read("*a") -- string of whole bottom of site


siteF:write(startstub)


dofile("posts.lua")



siteF:write(endstub)
siteF:flush()
siteF:close()
