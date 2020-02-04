library(extrafont)

require(ggplot2)

pt2mm <- c(0.35277831682244)
pt2LineWidth <- 1/2.13
lineWidth = 2.75 * pt2LineWidth

neutral = "#4C4B4C"

theme_set(
  theme_minimal() +
    theme(
      text = element_text(family = "Proxima Nova T Cond", size = 9),  
      plot.title = element_text(size = 9, hjust = .5, face = "bold"),
      plot.subtitle = element_text(family = "Proxima Nova T Cond", 
                                   margin = margin(t = 0, r = 0, b = 12, l = 0, unit = "pt"),
                                   size = 9, face = "plain", hjust = 0, color = "#4C4B4C"),
      plot.background = element_blank(),
      plot.margin = margin(t = 6, r = 10, b = 0, l = 0, unit = "pt"),
      panel.background = element_blank(),
      panel.grid.major = element_blank(),
      panel.grid.minor = element_blank(),
      axis.line = element_line(size = .5*pt2LineWidth, color = "#4C4B4C"),
      axis.ticks = element_line(size = .5*pt2LineWidth, color = "#4C4B4C"),
      axis.ticks.length = unit(-3, "pt"),
      axis.text.x = element_text(family = "Proxima Nova T Cond", 
        size = 9, face = "plain", margin = margin(t = 10 , r = 0, b = 0, l = 0, unit = "pt"),
        color = "#4d4d4d"),
      axis.text.y = element_text(family = "Proxima Nova T Cond", 
        size = 9, face = "plain", margin = margin(t = 0 , r = 10, b = 0, l = 0, unit = "pt"),
        color = "#4d4d4d"),
      axis.title.x = element_blank(), axis.title.y = element_blank(),
      complete = F, 
      validate = T,
      legend.position="none",
      legend.justification = "right",
      legend.key.size = unit(9,"pt"),
      legend.text = element_text(family = "Proxima Nova T Cond", size = 9, face = "plain", hjust = 0, color = "#4C4B4C",
                                 margin = margin(t = 0, r = 6, b = 0, l = 0, unit = "pt")),
      legend.margin = margin(t = 0, r = 0, b = 0, l = 0, unit = "pt"),
      legend.spacing.x = unit(6, "pt"),
      # legend.title=element_blank(),
      legend.title = element_text(color = "#4C4B4C"),
      panel.spacing = unit(24, "pt"),
      strip.text = element_text(face = "bold", size = 9)
    )
)

axisTitle = element_text(family = "Proxima Nova T Cond", size = 9, face = "plain", hjust = .5, color = "#4C4B4C",
                         margin = margin(t = 6, l = 0, b = 0, r = 0, unit = "pt"))

update_geom_defaults("text", list(family = "Proxima Nova T Cond", size = 9*pt2mm, fontface = "bold", color = "white"))

teals2 <- c("#003e53", "#3a7b93")
teals3 <- c("#002235","#105c72","#5d9db5")
teals4 <- c("#002235","#00475d","#2e7187","#5d9db5")
teals5 <- c("#002235","#003e53","#105c72","#3a7b93","#5d9db5")

spending2 <- teals2
spending3 <- teals3
spending4 <- teals4
spending5 <- teals5

greens2 <- c("#054011", "#4A7F4A")
greens3 <- c("#002400","#2a5e2c","#6aa069")
greens4 <- c("#002400","#134a1a","#3f7440","#6aa069")
greens5 <- c("#002400","#054010","#2a5e2c","#4a7e4a","#6aa069")

revenue2 <- greens2
revenue3 <- greens3
revenue4 <- greens4
revenue5 <- greens5

orange = "#d87939"
oranges2 = c("#490000", "#d87939")
oranges3 = c("#490000","#8c3900","#d87939")
oranges4 = c("#490000","#742400","#a54e0c","#d87939")
oranges5 = c("#490000","#691900","#8c3900","#b25818","#d87939")

debt <- c("#D074B4")
purples2 = c("#450035", "#D074B4")
purples3 = c("#450035","#883272","#D074B4")
purples4 = c("#450035","#711b5d","#a04887","#D074B4")
purples5 = c("#450035","#660D52","#883272","#ab5392","#D074B4")


gray1 = c("#7c7d80")
gray2 = c("#231f20", "#939598")
gray3 = c("#231f20","#7c7d80","#c7c8ca")
gray4 = c("#231f20","#636466","#939598","##c7c8ca")
gray5 = c("#231f20","#58595b","#808285","#a7a9ac","#d1d3d4")


recessionFill = "#d2d2d2"

projectedMarker <- function (date, label = TRUE) { # date can be in the format of "2018-07-01" or 2018.5, depending on your x scale type
  
  if(typeof(date)=="character") {
    xpos = as.Date(date)
  } else {
    xpos = date
  }
  
  line = geom_vline(xintercept = xpos, linetype = "22", color=neutral, size = .5 * pt2LineWidth)
  
  if(label) {
    list(
      line,
      annotate("text", label = "   Projected", x = xpos, y = Inf, hjust = "left", vjust = 1.1, family = "Proxima Nova T Cond", size = 8*pt2mm, color = neutral, fontface="plain")
    )
  } else {
    line
  }
}

expandRightMargin = function (extramargin) {
  theme(plot.margin = margin(t = 5.5, r = 6 + extramargin, b = 5.5, l = 0, unit = "pt"))
}

actualProjected <- function (date, nudge = 180, historical = FALSE) {

  list(
    geom_vline(xintercept = as.Date(date), linetype = "22", color="#4d4d4d", size = .5 * pt2LineWidth),
    annotate("text", label="Projected", x=as.Date(date) + nudge, y=Inf, hjust="left", vjust=1.1,
             family= theme_get()$text[["family"]],
             size=8*pt2mm, color = "#4d4d4d"),
    annotate("text", label=ifelse(historical, "Historical", "Actual"), x=as.Date(date) - nudge, y=Inf, hjust="right", vjust=1.1,
             family= theme_get()$text[["family"]],
             size=8*pt2mm, color = "#4d4d4d")
  )
}

actualProjected <- function (date, nudge = 180, historical = FALSE) {

  list(
    geom_vline(xintercept = as.Date(date), linetype = "22", color="#4d4d4d", size = .5 * pt2LineWidth),
    annotate("text", label="   Projected", x=as.Date(date), y=Inf, hjust="left", vjust=1.1,
             family= theme_get()$text[["family"]],
             size=8*pt2mm, color = neutral, fontface="plain")
  )
}



actualProjectedNotDate <- function (date, nudge = .5) {

  list(
    geom_vline(xintercept = date, linetype = "22", color="#4d4d4d", size = .5 * pt2LineWidth),
    annotate("text", label="   Projected", x=date, y=Inf, hjust="left", vjust=1.1,
             family= theme_get()$text[["family"]],
             size=8*pt2mm, color = neutral, fontface = "plain")
  )
}

actualProjectedUnlabelled <- function (date, nudge = 180) {

  geom_vline(xintercept = as.Date(date), linetype = "22", color="#4d4d4d", size = .5 * pt2LineWidth)
}

baselineLine <- function () {
  
  geom_hline(yintercept = 0, color=neutral, size = .5 * pt2LineWidth)
}

averageline <- function (average, nudge = 180) {
  
  geom_hline(yintercept = (average), linetype = "22", color="#4d4d4d", size = .5 * pt2LineWidth)
}

yScale = function (bottom, top, interval) {
  scale_y_continuous(expand = c(0,0), breaks = seq(bottom,top,interval), limits = c(bottom,top)) 
}

defaultSave = function () {
  ggsave("plot.pdf", width = 5.5, height = 2.75, units = "in", useDingbats=FALSE)
}

defaultSave_1col = function () {
  ggsave("plot.pdf", width = 3.375, height = 2.75, units = "in")
}


hideYScale = function () {
  theme(axis.line.y = element_blank(),
        axis.ticks.y = element_blank(),
        axis.text.y = element_blank())
}

hideXScale = function () {
  theme(axis.line.x = element_blank(),
        axis.ticks.x = element_blank(),
        axis.text.x = element_blank())
}

recessions = read.table(textConnection(
  "Peak, Trough
  1857-06-01, 1858-12-01
  1860-10-01, 1861-06-01
  1865-04-01, 1867-12-01
  1869-06-01, 1870-12-01
  1873-10-01, 1879-03-01
  1882-03-01, 1885-05-01
  1887-03-01, 1888-04-01
  1890-07-01, 1891-05-01
  1893-01-01, 1894-06-01
  1895-12-01, 1897-06-01
  1899-06-01, 1900-12-01
  1902-09-01, 1904-08-01
  1907-05-01, 1908-06-01
  1910-01-01, 1912-01-01
  1913-01-01, 1914-12-01
  1918-08-01, 1919-03-01
  1920-01-01, 1921-07-01
  1923-05-01, 1924-07-01
  1926-10-01, 1927-11-01
  1929-08-01, 1933-03-01
  1937-05-01, 1938-06-01
  1945-02-01, 1945-10-01
  1948-11-01, 1949-10-01
  1953-07-01, 1954-05-01
  1957-08-01, 1958-04-01
  1960-04-01, 1961-02-01
  1969-12-01, 1970-11-01
  1973-11-01, 1975-03-01
  1980-01-01, 1980-07-01
  1981-07-01, 1982-11-01
  1990-07-01, 1991-03-01
  2001-03-01, 2001-11-01
  2007-12-01, 2009-06-01"), sep=',',
  colClasses=c('Date', 'Date'), header=TRUE)

toDate = function (x, shift = 0) { as.Date(ISOdate(x, 1 + shift, 1)) }

recessionBars = function (yearsSeries) {   geom_rect(data = subset(recessions, Peak >= min(yearsSeries)),
                                                     mapping = aes(xmin=Peak, xmax=Trough, ymin=-Inf, ymax=+Inf), fill=recessionFill) }
