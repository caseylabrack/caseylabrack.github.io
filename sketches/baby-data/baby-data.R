library(sysfonts)
library(showtext)
# library(extrafont)
library(tidyverse)
library(lubridate)

data = read_csv("baby-data-raw.csv") %>% 
  select(-c(3:8)) %>% 
  mutate(datetime = ymd_hms(Start)) %>% 
  mutate(time = hour(datetime) + minute(datetime)/60) %>% 
  mutate(dayNumber = as.numeric(date(datetime) - as.Date("2022-04-11"))) %>% 
  filter(Type %in% c("Diaper","Pump","Feed"))

sunrises = read_csv("sunrises-raw.csv") %>% 
  gather(key = month, value = time, 2:13) %>% 
  drop_na() %>% 
  mutate(date = dmy(paste0(Day, " ", month, ", 2022"))) %>% 
  mutate(time = hour(time) + minute(time)/60) %>% 
  mutate(dayNumber = as.numeric(date - as.Date("2022-04-11"))) %>% 
  filter(dayNumber >= 0 & dayNumber <= 76)

sunsets = read_csv("sunsets-raw.csv") %>% 
  gather(key = month, value = time, 2:13) %>% 
  drop_na() %>% 
  mutate(date = dmy(paste0(Day, " ", month, ", 2022"))) %>% 
  mutate(time = hour(time) + minute(time)/60) %>% 
  mutate(dayNumber = as.numeric(date - as.Date("2022-04-11"))) %>% 
  filter(dayNumber >= 0 & dayNumber <= 76)

ggplot(data, aes(x = ((time + 12) %% 24), y = dayNumber)) +
  geom_point() +
  scale_y_reverse() +
  scale_x_continuous(expand = c(0,0), breaks = c(12), labels = c("Midnight"))

write_csv(data, "baby-data.csv")
write_csv(sunrises, "sunrises.csv")
write_csv(sunsets, "sunsets.csv")