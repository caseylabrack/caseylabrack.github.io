startstub =  io.open("top.txt"):read("*a") -- string of whole top of site
endstub = io.open("bottom.txt"):read("*a") -- string of whole bottom of site

allPosts = {}
allTags = {index=true}
function post (p)
	table.insert(allPosts, p)
	for _,t in ipairs(p.tags) do
		allTags[t] = true
	end
end
dofile("posts.lua")

for tag,_ in pairs(allTags) do -- for each tag in use, make a webpage
	page = io.output(tag..".html")
	page:write(startstub)
	for _,p in ipairs(allPosts) do -- for each post, write to webpage if it contains the page's tag
		hasThisTag = false
		for _,t in ipairs(p.tags) do
			hasThisTag = (t==tag or hasThisTag)
		end
		if hasThisTag or tag=="index" then 
			page:write("<div class='post'>")
			page:write("<a href='"..p.url.."'>")
			page:write("<img src='./thumbs/"..p.thumbs.."' style='max-width:320px;' loading='lazy'/>")
			page:write("<h2>"..p.name.."</h2>")
			page:write("</a>")
			page:write("<p class='tag'>")
			for _,t in pairs(p.tags) do
				page:write("<a href='./" .. t .. ".html'>#"..t.."</a>&nbsp;&nbsp;")
			end
			page:write("<p class='description'>"..p.info.."</p>")
			page:write("</div>") 
		end
	end
	page:write(endstub)
	page:flush()
	page:close()
end
