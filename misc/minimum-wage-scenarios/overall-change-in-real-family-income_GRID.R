library(tidyverse)

source("CBO.R")

data = read_csv("aggregate-real-family-income_all.csv") %>% 
  filter(!(option %in% c("rtw", "rtw_ap"))) %>% 
  separate(option, into = c("targetYear", "wage", "tipped", "indexed"), sep = "_") %>%
  filter(targetYear==2026) %>% 
  select(-c(targetYear, earningsChange, pov_bin)) %>% 
  mutate(year = factor(year)) %>% 
  mutate(wage = factor(wage))

data$indexed = factor(data$indexed, levels = data$indexed %>% unique(),
                      labels = c("Wage Index:\nNone", "Wage Index:\nCPI", "Wage Index:\nMedian Wage"))

data$tipped = factor(data$tipped, levels = data$tipped %>% unique(),
                     labels = c("Tipped Wage:\nNo Change", "Tipped Wage:\nHalf Regular", "Tipped Wage:\nSame as\nRegular"))

ggplot(data, aes(x = year, y = incomeChange, group = wage, color = wage)) +
  geom_line(size = lineWidth) +
  baselineLine() +
  scale_x_discrete(expand = c(0,0), breaks = c(2020,2023,2026, 2029)) +
  scale_y_continuous(expand = c(0,0), limits = c(-10,2), breaks = seq(-10,2,2)) +
  facet_grid(rows = vars(tipped), cols = vars(indexed)) +
  scale_color_manual(values = c("#ffcac2", "#f49598", "#c86d89", "#895381", "#4c3b66", "#21223a"), 
                     name = "Minimum Wage",
                     # labels = paste0("$", seq(10,15,1)),
                     labels = c("$10",seq(11,15,1))) +
  # scale_color_manual(values = c("#ffcbbc", "#ff907f", "#e75a5b", "#ba3148", "#7d2036", "#401620"), name = "Minimum Wage") +
  theme(strip.text.y = element_text(angle = 0, hjust = 0)) +
  theme(legend.position = "bottom", legend.spacing.x = unit("0","pt")) +
  theme(legend.text.align = 1) +
  theme(panel.spacing = unit(36, "pt")) +
  guides(col = guide_legend(nrow = 1, title.position = "top", label.position = "bottom"))

ggsave("grid.pdf", width = 7, height = 7, units = "in")