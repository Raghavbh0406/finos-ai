package com.finosai.Backend.gst;

import com.finosai.Backend.gst.dto.GstRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gst")
public class GstController {

    private final GstService gstService;

    public GstController(
            GstService gstService) {

        this.gstService = gstService;
    }

    @PostMapping("/calculate")
    public GstResponse calculate(
            @RequestBody GstRequest request) {

        return gstService.calculateGst(
                request
        );
    }
}